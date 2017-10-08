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
  console.log("API Key set");
  search();
  console.log("search called");
}


//this tests checkMarks method
console.log($('#HomeCheckList ul li')[recentUnchecked].innerHTML.substring(32));

//working on alternate search because previous search is not working
//https://www.youtube.com/watch?v=AF_SzRN6fYM&pbjreload=10
//look at above link

var q =  $('#HomeCheckList ul li')[recentUnchecked].innerHTML.substring(32);

console.log(q);

function search() {
  var request = gapi.client.youtube.search.list({
    q: q,
    part: 'snippet, id',
    type: 'video'
  });

  request.execute(function(response) {
    var str = JSON.stringify(response.result);
    $('#HomeResources').html('<pre>' + str + '</pre>');
  });
}