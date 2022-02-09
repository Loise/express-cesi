
var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
	name: String,
	address: String,
	phone: String,
	email: String,
	CB: String,
	password: String
}, {
	collection: 'Users'
})

var User = mongoose.model('User', userSchema);
module.exports = User;