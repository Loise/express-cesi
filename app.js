const express = require('express');
const app = express();
const port = 3000;
var mongoose = require('mongoose');
const dotenv = require('dotenv');
var routeStudent = require('./routes/student')
var routeUser = require('./routes/user')
var cors = require('cors')

const http = require('http');
const socketIo = require("socket.io");


const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

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

app.set('socketio', io);

app.get('/', (req, res) => {
  res.send(`Hello World! ---- request time ${req.requestTime}`)
});

app.use('/student/',routeStudent);
app.use('/user/',routeUser);



const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);


  socket.on("joinRoom", ({ username, roomname }) => {
    socket.join(roomname);
    socket.emit(roomname, `Welcome ${username} on ${roomname}`);
    socket.broadcast.to(roomname).emit(roomname, `${username} has joined the room ${roomname}`);
  });

  socket.on('chat message', ({ username, roomname, msg }) => {
    io.emit(roomname, `${username} on ${roomname}: ${msg}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
  
});


server.listen(port, () => {
  console.log(`Application exemple à l'écoute sur le port ${port}!`)
});