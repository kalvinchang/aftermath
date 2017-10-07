//for the checkmarks
$("#HomeCheckList ul li img").click(function(){
  if($(this).attr("src")==="assets/checked.svg"){
    $(this).attr("src", "assets/unchecked.svg");
  }
  else{
    $(this).attr("src", "assets/checked.svg");
  }
  //calls to update when uesr checks off items
  checkMarks();
});


//for the YouTube

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


function onClientLoad() {
  gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

function onYouTubeApiLoad() {
  gapi.client.setApiKey('AIzaSyD7NybHdEUpObHST_6kkWtK3TYVWZnYKV8');
  searcher();
}
  searcher();

//placeholder search function with the essetial values we need
//maxReults to type are the important values
function search() {
  var request = gapi.client.youtube.search.list({
      maxResults: '7',
      part: 'id',
      q: $('#HomeBody ul li')[recentUnchecked].innerHTML.substring(32),
      type: 'video'
  });
}

request.execute(function (response) {
  console.log(response);
})

// The client ID is obtained from the {{ Google Cloud Console }}
// at {{ https://cloud.google.com/console }}.
// If you run this code from a server other than http://localhost,
// you need to register your own client ID.
var OAUTH2_CLIENT_ID = '780139124013-o6mce862so8m6le123l82924c3vgeroc.apps.googleusercontent.com';
var OAUTH2_SCOPES = [
  'https://www.googleapis.com/auth/youtube'
];

// Upon loading, the Google APIs JS client automatically invokes this callback.
googleApiClientReady = function() {
  gapi.auth.init(function() {
    window.setTimeout(checkAuth, 1);
  });
}

// Attempt the immediate OAuth 2.0 client flow as soon as the page loads.
// If the currently logged-in Google Account has previously authorized
// the client specified as the OAUTH2_CLIENT_ID, then the authorization
// succeeds with no user intervention. Otherwise, it fails and the
// user interface that prompts for authorization needs to display.
function checkAuth() {
  gapi.auth.authorize({
    client_id: OAUTH2_CLIENT_ID,
    scope: OAUTH2_SCOPES,
    immediate: true
  }, handleAuthResult);
}

// Handle the result of a gapi.auth.authorize() call.
function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    // Authorization was successful. Hide authorization prompts and show
    // content that should be visible after authorization succeeds.
    $('.pre-auth').hide();
    $('.post-auth').show();
    loadAPIClientInterfaces();
  } else {
    // Make the #login-link clickable. Attempt a non-immediate OAuth 2.0
    // client flow. The current function is called when that flow completes.
  }
}

// Load the client interfaces for the YouTube Analytics and Data APIs, which
// are required to use the Google APIs JS client. More info is available at
// https://developers.google.com/api-client-library/javascript/dev/dev_jscript#loading-the-client-library-and-the-api
function loadAPIClientInterfaces() {
  gapi.client.load('youtube', 'v3', function() {
    handleAPILoaded();
  });
}
auth.js

//this tests checkMarks method
console.log($('#HomeCheckList ul li')[recentUnchecked].innerHTML.substring(32));

//working on alternate search because previous search is not working
//https://www.youtube.com/watch?v=AF_SzRN6fYM&pbjreload=10
//look at above link


function searcher() { 
  $.GET, "https://www.googleapis.com/youtube/v3/search", {
    maxResults: '7',
    part: 'id, snippet',
    q: $('#HomeBody ul li')[recentUnchecked].innerHTML.substring(32),
    type: 'video',
    key: 'AIzaSyD7NybHdEUpObHST_6kkWtK3TYVWZnYKV8'},
    
    function(data){
      var nextToken = data.nextPageToken;
      var prevToken = data.prevPageToken;

      console.log(data);

      $.each(data.items, function(i, item){
        var output = getOutput(item);
        $('#result').append(output);
      })      

    }
  
}
function getOutput(item){
      var videoId = item.id.videoId;
      var title = item.snippet.title;

      var output = '<li class=""resourceitem>'+
      '<a href="https://www.youtube.com/watch?v="' +videoId+ '>'+
      title +
      '</a>'+
      '</li>'
}