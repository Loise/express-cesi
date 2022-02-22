var mongoose = require('mongoose');
var studentSchema = mongoose.Schema({
	name: String,
	age: Number,
	color: String
}, {
	collection: 'Students'
})

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;