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
			// console.log('in route');
			Stock.findOne({symbol: req.query.stock.toUpperCase()}, function(err, stock) {
				if (err) throw err;
				if (!stock) {
					var stock = new Stock({
						symbol: req.query.stock.toUpperCase(),
					});
					stock.save();
					
				}
			});
			res.redirect('/')
		});
		
	app.route('/remove_stock')
		.get(function(req, res, next) {
			Stock.findOne({symbol: req.query.stock.toUpperCase()}).remove().exec();
		})
		
		
	app.route('/get_all_stocks')
		.get(function(req, res, next) {
			var now = new Date();
			var oneYearAgo = new Date();
			var oneYearAgoMs = now.getTime() - 1000 * 60 * 60 * 24 * 365;
			oneYearAgo.setTime(oneYearAgoMs);
			Stock.find({}, function(err, stocks) {
				if (err) throw err;

				var SYMBOLS = stocks.map((stock) => { return stock.symbol; });
				if (SYMBOLS.length > 0) {
						googleFinance.historical({
							symbols: SYMBOLS,
							from: oneYearAgo,
							to: now,
						})
						.then((results) => {
							var symbols = Object.keys(results);
							var values = Object.keys(results).map((key) => { return results[key]; })
							res.json(values.map((value, i) => { return {
									symbol: symbols[i],
									data: value
											.map((datum) => {
										return {
											date: datum.date,
											price: datum.high,
										};
									})
											.filter((e, i) => {
												return i % 10 === 0;
											}),
								}
							
							}));
						});
		
					} else {
						res.json([]);
					}
			})
		})
};
