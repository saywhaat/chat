var express = require('express');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';

MongoClient.connect(url, function(err, db) {
    console.log("Connected correctly to server.");
    db.close();
});

var ip = process.env.OPENSHIFT_NODEJS_IP || 'localhost';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8081;

var app = express();
var server = app.listen(port, ip);

app.use(express.static('client'));
