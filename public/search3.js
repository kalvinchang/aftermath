function tplawesome(e,t){res=e;for(var n=0;n<t.length;n++){res=res.replace(/\{\{(.*?)\}\}/g,function(e,r){return t[n][r]})}return res}

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
    extract();
    loader();
  });


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
//gets thing to search
var topic = $('#HomeCheckList ul li')[0].innerHTML.substring(32);
function extract(){
    topic = $('#HomeCheckList ul li')[recentUnchecked].innerHTML.substring(32);
}
//loads topic
function loader(){
    $('#load').attr('value', topic);
}



var inCheck = 0;
$(function() {
    $("#You").on("submit", function(e) {
       e.preventDefault();
       // prepare the request
        if(inCheck==0){
            init();
            inCheck++;
        }
       $("searcher").val()
       var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: topic,
            maxResults: 7,
            order: "viewCount",
            publishedAfter: "2015-01-01T00:00:00Z"
       });
       // execute the request
       request.execute(function(response) {
          var results = response.result;
          $("#results").html("");
          $.each(results.items, function(index, item) {
            $.get("tpl/item.html", function(data) {
                $("#results").append(tplawesome(data, [{"title":item.snippet.title, "videoid":item.id.videoId}]));
            });
          });
          resetVideoHeight();
       });
    });

    $(window).on("resize", resetVideoHeight);
});

function resetVideoHeight() {
    $(".video").css("height", $("#results").width() * 9/16);
}

function init() {
    gapi.client.setApiKey("AIzaSyCXr4nPaCa0iGMFYiX_QRaJ43noyvZGxGo");
    gapi.client.load("youtube", "v3", function() {
        // yt api is ready
    });
}
