//client-side JS
const config = {
    apiKey: "AIzaSyD0Fh_eak1Z-Lm_dDf_aXlhXWtToO-APD4",
    authDomain: "aftermathcac.firebaseapp.com",
    databaseURL: "https://aftermathcac.firebaseio.com",
    storageBucket: "aftermathcac.appspot.com",
};
firebase.initializeApp(config);
const database = firebase.database();

var socket = io(); // initiating request from client to server to open socket and stores into var

socket.on('connect', function (){
  console.log('Connected to server');
});

socket.on('disconnect', function (){
  console.log('Connected dropped/ Disconnected from Server');
});

socket.on('newMessage', function (message) {
  console.log('New message arrived.', message); // prints email and its object data
  var li = jQuery('<li><div class="receive"><div class="sender"><img src="assets/DefaultProfile.svg" alt="'+message.from+'"><h3>' +message.from+ '</h3></div><p>'+message.text+'</p></div></li>'); //creates html object

  jQuery('#messages').append(li); //gets the html li data onto the html ordered list

  $("#ChatBody section").animate({scrollTop: $('#messages').prop("scrollHeight")}, 1000);
});

// the object in the function arguments = thing used in the console.log to display the object
var messageTextbox = jQuery('[name=message]');
var userName;
//var groupId = ;

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  if (messageTextbox.val() != '') {
    socket.emit('createMessage', {
      from: userName,
      text: messageTextbox.val()
    }, function() {
      messageTextbox.val('');
      //send message to the database
      // database.ref('messages/' + groupId).set({
      //   prop: value
      // });

    });
  }
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    userName = user.displayName;
  } else {
    // No user is signed in.
    console.log('No user is signed in.');
  }
});