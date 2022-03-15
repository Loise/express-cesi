var express = require('express');
var app = express.Router();

const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

var mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;

var authenticateJWT = require('../tools/auth.js')

app.post('/signin', async (req, res, next) => {
	let userCreated = await User.create(req.body)
	res.send(userCreated)
})

app.post('/login', async (req, res) => {
    // On récupère le username et password
    const { email, password } = req.body;

    // On cherche l'utilisateur qui correspond
	const user = await User.findOne({email: email, password: password})

    if (user) {
        // On génère le token
        const accessToken = jwt.sign({ email: user.email, role: user.role }, process.env.TOKEN_SECRET);

        res.json({
            accessToken
        });
    } else {
        res.status(403).send('Wrong email or password');
    }
});

const adminPermission = (req, res, next) => {
    const { role } = req.user;

	if (role !== 'admin') {
        return res.sendStatus(403);
    }
    next();
}

app.get('/profile/:id', [authenticateJWT, adminPermission], async (req, res) => {
	const id = req.params.id;
	const user = await User.findOne({_id: ObjectID(id)});
    res.json(user);
});

app.get('/profile', authenticateJWT, async (req, res) => {
	const user = await User.findOne({email: req.user.email});
    res.json(user);
});




module.exports = app;
