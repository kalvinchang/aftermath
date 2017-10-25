//user info

// Initialize Firebase
var config = {
  apiKey: "AIzaSyD0Fh_eak1Z-Lm_dDf_aXlhXWtToO-APD4",
  authDomain: "aftermathcac.firebaseapp.com",
  databaseURL: "https://aftermathcac.firebaseio.com",
  projectId: "aftermathcac",
  storageBucket: "aftermathcac.appspot.com",
  messagingSenderId: "386683841943"
};

var app = firebase.initializeApp(config);
//var database = app.database();

var user;
var name, emailAddress, photoUrl, uid, emailVerified;

//customize home page to user
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    console.log(user);
    name = user.displayName;
    emailAddress = user.emailAddress;
    photoUrl = user.photoURL;
    emailVerified = user.emailVerified;
    uid = user.uid;

    console.log(name);
    console.log(emailAddress);
    console.log(photoUrl);
    console.log(emailVerified);
    console.log(uid);

  } else {
    // No user is signed in.
    console.log('No user is signed in.');
  }
});

/*
//for the checkmarks
$("#HomeCheckList ul li img").click(function(){
  if($(this).attr("src")==="assets/checked.svg"){
    $(this).attr("src", "assets/unchecked.svg");
  }
  else{
    $(this).attr("src", "assets/checked.svg");
  }
  //calls to update when user checks off items
  checkMarks();
});
*/

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
//for the YouTube

// 1. Load the JavaScript client library.




/*
//finds the most recent unchecked checklist item and records
//it's 'index' with recentUnchecked
var recentUnchecked = 0;
function checkMarks(){
  for(var i = 0; i <= $('#HomeBody ul li img').length; i ++){
    if ($('#HomeCheckList ul li img').eq(i).attr('src') === "assets/unchecked.svg" )  {
      recentUnchecked = i;
      break;
    }
  }
}
*/