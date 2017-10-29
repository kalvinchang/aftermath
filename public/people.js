var search = $('#searchWindow');

//appearances
$('.searchIcon').click(function(){
    search.css("top", "5%");
    search.css("visibility", "visible");
});
$('#searchWindow').mouseenter(function(){
    search.css("top", "5%");
    search.css("visibility", "visible");
});
$('#searchWindow').mouseover(function(){
    search.css("top", "5%");
    search.css("visibility", "visible");
});
$('#searchWindow').mouseleave(function(){
    search.css("top", "0%");
    search.css("visibility", "hidden");
});

var mates = $('#classmates li span');
//filler loop
for (var i = 0; i < mates.length; i++){
    mates[i] = $('#classmates li span')[i].innerHTML;
}

$('#searchWindow form').submit(function(event){
    event.preventDefault();
    return false;
});


var q = "";
//var exist = $('#searchWindow ul li');
$("#mate").on('input',(function(){
    q = $('#mate').val();
    /*
    for(var i = 0; i < exist.length; i++){
       exist[i] = exist[i].innerHTML(); 
    }
    */
    
    for(var i = $('#searchWindow ul li').length-1; i >= 0; i--){
        if($('#searchWindow ul li')[i].innerHTML.substring(0, q.length) !== q){
            $('#searchWindow ul li')[i].remove()
        }
    }
    for(var i = 0; i < mates.length; i++){
        var repeat = false;
        for(var j = 0; $('#searchWindow ul li').length ;j--){
            if(mates[i]==$('#searchWindow ul li')[j].innerHTML){
                repeat = true
            }
        }
        if(mates[i].substring(0,q.length)==q && repeat){
            //Doesn't append 
        }
        else if(mates[i].substring(0,q.length)==q){
           $("#searchWindow ul").append('<li>' + mates[i]+ '</li>'); 
        }
    }
}));