'use strict';

var debug = require('debug');
var error = debug('reportModel:error');
var log = debug('reportModel:log');

var mongoose = require('mongoose');
var mongooseUniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Route = new Schema({
    locationOne : { type: Object },
    locationTwo : { type: Object },
    locationThree : { type: Object }
});


// Route.set('toJSON', {
//     transform: function (doc, ret, options) {
//         return ret;
//     }
// });

module.exports = mongoose.model('Route', Route);