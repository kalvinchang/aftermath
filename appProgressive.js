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
    if ($('#HomeBody ul li img').eq(i).attr('src') === "assets/unchecked.svg" )  {
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
  search();
}


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

//this tests checkMarks method
console.log($('#HomeBody ul li')[recentUnchecked].innerHTML.substring(32));


//some code above is important, below is authentication and the sample search process


  request.execute(function(response) {
    var str = JSON.stringify(response.result);
    $('#search-container').html('<pre>' + str + '</pre>');
  });
