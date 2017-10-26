/*do not initialize / config firebase + user variables here 
b/c it's already initialized in messages.js*/

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
