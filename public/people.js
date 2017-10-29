var search = $('#searchWindow');

//appearances
$('.searchIcon').click(function(){
    search.css("top", "5%");
    search.css("visibility", "visible");
    $('#mate').trigger('click');
});
