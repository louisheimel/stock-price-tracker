'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Stock = new Schema({
    symbol: {type: String, required: true},
    data: {type: Array, required: true},
});

module.exports = mongoose.model('Stock', Stock);
