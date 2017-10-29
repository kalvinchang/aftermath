const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generatedMessage} = require('./utils/message'); //import function, from another directory

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', function (socket) { //called w/ socket, usually only one io. on call
  // ()=> is a call back function in second parameter to let you do something after connection
  console.log('New user connected');

  //socket.emit from Admin text Welcome to chat app
  socket.emit('newMessage', generatedMessage('Eric Siu', 'Welcome to Calculus BC Table 4 Study Group!'));

  // socket.broadcast.emit from ADmin text New user joined
  socket.broadcast.emit('newMessage', generatedMessage('Admin', 'New User joined.'))

  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data)); //makes the drawing collaborative
  socket.on('annotate', (data) => {
    socket.broadcast.emit('annotate', data);
    console.log(data);
  });
  //makes textboxes collaborative
  socket.on('textbox', (data) => {
    socket.broadcast.emit('textbox', data);
    console.log(data);
  });
  socket.on('textboxMove', (data) => {
    socket.broadcast.emit('textboxMove', data);
    console.log(data);
  });

  socket.on('createMessage', (message,callback) => { // the thing in the 2nd argument's parentheses is the event
    console.log('createMessage', message);
    io.emit('newMessage', generatedMessage(message.from, message.text));
    callback('This is from the server');
    //  createdAt: new Date().getTime()
  });
  socket.on('disconnect', () => {
    console.log('User has disconnected.');
  });

}); //method lets you register an event listener, connection = most simplest


server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
// If in node code, you can use => instead of function
