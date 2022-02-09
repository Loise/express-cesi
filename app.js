const express = require('express');
const app = express();
const port = 3000;
var mongoose = require('mongoose');
const dotenv = require('dotenv');
var routeStudent = require('./routes/student')
var routeUser = require('./routes/user')
var cors = require('cors')

const bodyParser = require('body-parser');

app.use(bodyParser.json());


dotenv.config();
var mongoDB = `mongodb+srv://${process.env.PWD_USER}:${process.env.PWD_BD}@clustercesi.bt6qj.mongodb.net/cesi?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
var db = mongoose.connection;

db.on('Error', console.error.bind(console, "MongoDB connection error"))

app.use(express.json());

app.use(cors())

var requestTime = function (req, res, next) {
  req.requestTime = Date.now();
  next();
};

app.use(requestTime);

var myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
};

//app.use(myLogger);

app.get('/', (req, res) => {
  res.send(`Hello World! ---- request time ${req.requestTime}`)
});

app.use('/student/',routeStudent);
app.use('/user/',routeUser);


app.listen(port, () => {
  console.log(`Application exemple à l'écoute sur le port ${port}!`)
});