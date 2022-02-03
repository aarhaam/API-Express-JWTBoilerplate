var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('users', new Schema({
    email : String,
    password : String
}));