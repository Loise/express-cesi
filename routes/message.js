var express = require('express');
var app = express.Router();

const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const Message = require('../models/message');

var mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;

var authenticateJWT = require('../tools/auth.js')

app.post('/', authenticateJWT, async (req, res) => {
	let messageCreated = await Message.create(req.body)
	res.send(messageCreated)
})

app.get('/', authenticateJWT, async (req, res) => {
	const messages = await Message.find();
    res.json(messages);
});




module.exports = app;
