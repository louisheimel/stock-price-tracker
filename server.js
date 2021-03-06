'use strict';
var http = require('http');
var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var Stock = require('./app/models/stocks.js');


var app = express();

var server = require('http').Server(app);
var io = require("socket.io")(server);

io.on('connection', function(socket) {
	console.log('client connected');
	socket.on('join', function(data) {
        console.log(data);
        socket.emit('messages', 'Hello from server');
    });
    
    socket.on('new_ticker', function(e) {
    	console.log('symbol added: ' + e.toUpperCase());
    	Stock.findOne({symbol: e.toUpperCase()}, function(err, stock) {
			if (err) throw err;
			if (!stock) {
				var stock = new Stock({
					symbol: e.toUpperCase(),
				});
				stock.save();
			}
		});
		io.emit('updateui');
    });
    
    socket.on('updateuionallsockets', function(e) {
    	io.emit('updateui');
    })
})

require('dotenv').load();

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

routes(app, passport);

server.listen(process.env.PORT || 8080);