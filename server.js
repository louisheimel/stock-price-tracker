'use strict';
var http = require('http');
var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var app = express();

var server = require('http').Server(app);
var io = require("socket.io")(server);

io.on("connection", function(socket) {
	socket.emit("something", { str: 'something' });
});

require('dotenv').load();

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

routes(app, passport);

// // var port = process.env.PORT || 8080;
// // app.listen(port,  function () {
// // 	console.log('Node.js listening on port ' + port + '...');
// // });

server.listen(process.env.PORT || 8080);