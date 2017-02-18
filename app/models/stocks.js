'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Stock = new Schema({
    symbol: {type: String, required: true},
});

module.exports = mongoose.model('Stock', Stock);