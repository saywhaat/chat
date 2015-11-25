var express = require('express');

var ip = process.env.OPENSHIFT_NODEJS_IP || 'localhost';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8081;

var app = express();
var server = app.listen(port, ip);

app.use(express.static('client'));
