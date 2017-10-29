 //making the topics display
 var testDate = $('#testHeader').text();
$('#testDay').text(testDate);

$('#pOne h3').text($('#gOne').text() + "'s topics");
$('#pTwo h3').text($('#gTwo').text() + "'s topics");
$('#pThree h3').text($('#gThree').text() + "'s topics");

$('#gOne').mouseenter(function(){
    $('#pOne').css('top','5%');
    $('#pOne').css('visibility','visible');
});
$('#gOne').mouseleave(function(){
    $('#pOne').css('top','10%');
    $('#pOne').css('visibility','hidden');
});
$('#gTwo').mouseenter(function(){
    $('#pTwo').css('top','5%');
    $('#pTwo').css('visibility','visible');
});
$('#gTwo').mouseleave(function(){
    $('#pTwo').css('top','10%');
    $('#pTwo').css('visibility','hidden');
});
$('#gThree').mouseenter(function(){
    $('#pThree').css('top','5%');
    $('#pThree').css('visibility','visible');
});
$('#gThree').mouseleave(function(){
    $('#pThree').css('top','10%');
    $('#pThree').css('visibility','hidden');
});