var express = require('express');
var app = express.Router();

const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

var mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;

const authenticateJWT = (req, res, next) => {
	//on récupère le Bearer token
    const authHeader = req.headers.authorization;

    if (authHeader) {
    	//on ne prends que le token
        const token = authHeader.split(' ')[1];

        //on vérifie si le token à bien été signé avec le secret et qu'il est toujours valide
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
            	//on retourne une erreur de permission si invalide
                return res.sendStatus(403);
            }
            //on ajoute à la requete le user du token
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

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
        res.send('Email or password incorrect');
    }
});

app.get('/profile/:id', authenticateJWT, async (req, res) => {
	const { role } = req.user;
	const id = req.params.id;

	if (role !== 'admin') {
        return res.sendStatus(403);
    }
    
	const user = await User.findOne({_id: ObjectID(id)});
    res.json(user);
});

app.get('/profile', authenticateJWT, async (req, res) => {
	const user = await User.findOne({email: req.user.email});
    res.json(user);
});




module.exports = app;
