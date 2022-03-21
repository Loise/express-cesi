
var mongoose = require('mongoose');
var messageSchema = mongoose.Schema({
	name: String,
	room: String,
	message: String
}, {
	collection: 'Messages',
	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

var Message = mongoose.model('Message', messageSchema);
module.exports = Message;