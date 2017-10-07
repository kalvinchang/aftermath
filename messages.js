var socket = io(); // initiating request from client to server to open socket and stores into var

socket.on('connect',function (){
  console.log('Connected to server');
});

socket.on('disconnect', function (){
  console.log('Connected dropped/ Disconnected from Server');
});

socket.on('newMessage', function (message){
  console.log('New message arrived.', message); // prints email and its object data
  var li = jQuery('<li></li>'); //creates html object
  li.text(`${message.from}: ${message.text}`)  // gets the edata

  jQuery('#messages').append(li); //gets the html li data onto the html ordered list
});

// the object in the function arguments = thing used in the console.log to display the object

jQuery('#message-form').on('submit', function(e){
  e.preventDefault();// prevent default behavior of button that refreshes page

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val() // jquery selects any obj with name message, and val() grabs that value
  }, function(){

  })
});
socket.on('createMessage', (message,callback) => { // the thing in the 2nd argument's parentheses is the event
  console.log('createMessage', message);
  socket.emit('newMessage', generatedMessage(message.from, message.text))
  callback('This is from the server');
});
