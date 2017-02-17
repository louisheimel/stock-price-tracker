'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
// var StockHandler = require(path + '/app/controllers/stockHandler.server.js');
var googleFinance = require('google-finance');
var Stock = require('../models/stocks.js');


module.exports = function (app, passport) {

	var clickHandler = new ClickHandler();
	// var stockHandler = new StockHandler();

	app.route('/')
		.get(function(req, res, next) {
			res.sendFile(path + '/public/index.html');
		});
		
	app.route('/get_stock')
		.get(function(req, res, next) {
			googleFinance.historical({
			    symbol: 'NASDAQ:' + req.query.stock.toUpperCase(),
			    from: '2014-01-01',
			    to: '2014-12-31',
			}, function(err, data) {
			    if (err) throw err;
			    Stock.findOne({symbol: req.query.stock.toUpperCase()}, function(err, stock) {
			    	if (err) throw err;
			    	if (!stock) {
			    		var stock = new Stock({
					    	symbol: req.query.stock.toUpperCase(),
					    	data: data,
					    });
					    stock.save();
			    	}
			    })

			    res.json(data);
			});
		});
		
	app.route('/get_all_stocks')
		.get(function(req, res, next) {
			Stock.find({}, function(err, stocks) {
				res.json(stocks);
			})
		})
};
