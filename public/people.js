var search = $('#searchWindow');

//appearances
$('.searchIcon').mouseenter(function(){
    search.css("top", "5%");
    search.css("visibility", "visible");
});
$(search).mouseenter(function(){
    search.css("top", "5%");
    search.css("visibility", "visible");
});
$('.searchIcon').mouseleave(function(){
    search.css("top", "0");
    search.css("visibility", "hidden");
});
$(search).mouseleave(function(){
    search.css("top", "0");
    search.css("visibility", "hidden");
});

//for input
/*
var list = $('#classmates li');
var input = $('#mate');
var search=" ";
input.keypress(function(){
    search = input.attr('value');
});
*/
