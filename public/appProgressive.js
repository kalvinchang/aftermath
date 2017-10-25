//do not initialize / config firebase here b/c it's already initialized in messages.js

//customize home page to user
var name, email, photoUrl, uid, emailVerified;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    console.log(user);
    name = user.displayName;
    email = user.email;
    uid = user.uid;

    //display user data
    document.getElementById('name').textContent = name;
  } else {
    // No user is signed in.
    console.log('No user is signed in.');
  }
});

//Navigation
$('#Home sidebar section div a').click(function(){
  $('#Chat').css('transform', 'none');
});

$('#Home sidebar #setting img').click(function(){
  $('#Settings').css('transform', 'translateY(-100%)');
});

$('#Settings header img').click(function(){
  $('#Settings').css('transform', 'none');
});

$('#Chat #MessageList #back').click(function(){
  $('#Chat').css('transform', 'translateY(-100%)');
});
