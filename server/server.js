const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generatedMessage} = require('../utils/message') //import function, from another directory


const publicPath = path.join(__dirname, '../');
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



  socket.on('createMessage', (message,callback) => { // the thing in the 2nd argument's parentheses is the event
    console.log('createMessage', message);
    io.emit('newMessage', generatedMessage(message.from, message.text))
    callback('This is from the server');
    //  from:message.from,
    //  text:message.text,
    //  createdAt: new Date().getTime()
    //}); //emits an event to every single connection, while socket.emit only emits to a single connection
    //socket.broadcast.emit('newMessage', { // broadcast has same function as socket, but the user that sends doesn't get the message
    //  from: message.from,
  //    text: message.text,
    //  createdAt: new Date().getTime()
  //  });
  });
  socket.on('disconnect', () => {
    console.log('User has disconnected.');
  });

}); //method lets you register an event listener, connection = most simplest


server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
// If in node code, you can use => instead of function
