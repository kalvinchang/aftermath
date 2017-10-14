//client-side JS

var socket = io(); // initiating request from client to server to open socket and stores into var

socket.on('connect', function (){
  console.log('Connected to server');
});

socket.on('disconnect', function (){
  console.log('Connected dropped/ Disconnected from Server');
});

/*The original stuff
socket.on('newMessage', function (message){
  console.log('New message arrived.', message); // prints email and its object data
  var li = jQuery('<li></li>'); //creates html object
  li.text(message.from + ': ' + message.text);  // gets the edata

  jQuery('#messages').append(li); //gets the html li data onto the html ordered list
});
*/

socket.on('newMessage', function (message){
  console.log('New message arrived.', message); // prints email and its object data
  var li = jQuery('<li><div class="receive"><div class="sender"><img src="" alt="'+message.from+'"><h3>' +message.from+ '</h3></div><p>'+message.text+'</p></div></li>'); //creates html object

  jQuery('#messages').append(li); //gets the html li data onto the html ordered list
});

// the object in the function arguments = thing used in the console.log to display the object

var messageTextbox = jQuery('[name=message]');

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();

  if (messageTextbox.val() != '') {
    socket.emit('createMessage', {
      from: 'User', //replace w/ actual user later
      text: messageTextbox.val()
    }, function() {
      messageTextbox.val('');
    });
  }
});