var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var _ = require('lodash');
var crypto = require('crypto');
var MongoClient = require('mongodb').MongoClient;
var WebSocket = require("websocket");
var ObjectId = require('mongodb').ObjectID;

var connectionSting = 'mongodb://localhost:27017/chat';

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
    connectionSting = 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    process.env.OPENSHIFT_APP_NAME;
}

var ip = process.env.OPENSHIFT_NODEJS_IP || 'localhost';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8081;

var app = express();
var server = app.listen(port, ip);

var data = [
    { name: "Nagibator123", hash: "eed8517d7a94834f425f78222342d17b3c72333c77b491ac7c10b8d696e0b081" },
    { name: "test", hash: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08" },
    { name: "Kostik", hash: "70639403d6df730ef4f2aa6be1e2e343bf208998519f758b9ee71dead3ae28b2" },
    { name: "Vladisha", hash: "d2df071e6354fba182e9173d14b81f11f6776bfa5d7a697943ea057790454d4a" }
];

/*MongoClient.connect(connectionSting, function(err, db) {
    db.collection('users').deleteMany({}, function(err, results){
        db.collection('users').insert(data, function(){
            db.close();
        });
    });
});*/

app.use(express.static('client'));
app.use(cookieParser());
app.use(bodyParser.json());

app.post('/api/getToken', function(req, res) {
    var session = req.cookies.session;

    if (session) {
        console.log(1);
    }

    res.send(JSON.stringify({
        token: null
    }));
});

app.post('/api/friends', function(req, res) {
    var token = req.body.token;

    MongoClient.connect(connectionSting, function(err, db) {
        db.collection('users').findOne({ hash: token }, function(err, result){
            if(result){
                db.collection('users').find({ hash: { $ne: token } }).toArray(function(err, result){
                    res.send(JSON.stringify(_.map(result, function(item){
                        return {
                            id: item._id.toString(),
                            name: item.name
                        };
                    })));

                    db.close();
                });
            }
        });
    });
});

app.post('/api/me', function(req, res) {
    var token = req.body.token;

    MongoClient.connect(connectionSting, function(err, db) {
        db.collection('users').findOne({ hash: token }, function(err, result){
            if(result){
                res.send({
                    id: result._id.toString(),
                    name: result.name
                });

                db.close();
            }
        });
    });
});

app.post('/api/unread', function(req, res) {
    var token = req.body.token;

    MongoClient.connect(connectionSting, function(err, db) {
        db.collection('users').findOne({ hash: token }, function(err, result){
            if(result){
                var lastRead = result.lastRead || 0;

                db.collection('messages').find({ time: { $gt: lastRead }}).toArray(function(err, result){
                    res.send(JSON.stringify(_.map(result, function(item){
                        return {
                            text: item.text,
                            userId: item.userId
                        };
                    })));

                    db.close();
                });
            }
        });
    });
});

app.post('/api/signIn', function(req, res) {
    var session = req.cookies.session;
    var key = req.body.key;
    var hash = String(crypto.createHash('sha256').update(key).digest('hex'));

    if (session) {
        console.log(11);
    }

    MongoClient.connect(connectionSting, function(err, db) {
        db.collection('users').findOne({ hash: hash }, function(err, result){
            if(result){
                res.send(JSON.stringify({
                    token: hash
                }));
            }else{
                res.send(JSON.stringify({
                    token: null
                }));
            }

            db.close();
        });
    });
});

app.get('*', function (request, response){
    response.sendFile(__dirname + '/index.html');
});

var wsServer = new WebSocket.server({
    httpServer: server
});

var connections = [];

wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    var index = connections.push(connection) - 1;

    connection.on('close', function() {
        connections.splice(index, 1);
    });

    connection.on('message', function(message) {
        var data = JSON.parse(message.utf8Data);
        var token = data.token;

        MongoClient.connect(connectionSting, function(err, db) {
            db.collection('users').findOne({ hash: token }, function(err, result){
                if(result){
                    var userId = result._id.toString();

                    if(data.type === "send"){
                        db.collection('messages').insertOne({
                            text: data.text,
                            userId: userId,
                            time: Date.now()
                        }, function(){
                            connections.forEach(function(connection){
                    			connection.sendUTF(JSON.stringify({
                                    text: data.text,
                                    userId: userId,
                                    type: 'receive'
                                }));
                    		});

                            db.close();
                        });
                    }else if(data.type === "markAllRead"){
                        db.collection('users').update({ hash: token }, { $set: { lastRead: Date.now() }}, function(){
                            db.close();
                        });
                    }
                }
            });
        });
    });
});

/*




















*/
