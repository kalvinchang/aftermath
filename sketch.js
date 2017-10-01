//source: https://socketio-whiteboard.now.sh/
'use strict';

(function() {
  var tool; //take out if unused
  var socket = io();
  //DOM
  var canvas = document.getElementsByClassName('whiteboard')[0];
  var colors = document.getElementsByClassName('color');
  var context = canvas.getContext('2d');
  var undo = document.getElementById('undo');
  var redo = document.getElementById('redo');

  //object to store current settings
  var current = {
    color: 'black'
  };
  var drawing = false;

  //history - undo / redo

  // var history = {
  //   redo_list: [],  //stack
  //   undo_list: [],  //stack
  //   saveState: function(canvas, list, keep_redo) {
  //     keep_redo = keep_redo || false;
  //     if(!keep_redo) {
  //       this.redo_list = [];
  //     }
  //     (list || this.undo_list).push(canvas.toDataURL());
  //   },
  //   undo: function(canvas, ctx) {
  //     console.log('undo');
  //     this.restoreState(canvas, ctx, this.undo_list, this.redo_list);
  //   },
  //   redo: function(canvas, ctx) {
  //     console.log('redo');
  //     this.restoreState(canvas, ctx, this.redo_list, this.undo_list);
  //   },
  //   restoreState: function(canvas, ctx, pop, push) {
  //     if(pop.length) {
  //       this.saveState(canvas, push, true);
  //       var restore_state = pop.pop();
  //       var img = new Element('img', {
  //         'src': restore_state
  //       });
  //       img.onload = function() {
  //         ctx.clearRect(0, 0, 600, 400);
  //         ctx.drawImage(img, 0, 0, 600, 400, 0, 0, 600, 400);
  //       }
  //     }
  //   }
  // }

  //DOM - update settings
  canvas.addEventListener('mousedown', onMouseDown, false);
  canvas.addEventListener('mouseup', onMouseUp, false);
  canvas.addEventListener('mouseout', onMouseUp, false);
  canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);
  undo.addEventListener('click', function() {
    //history.undo(canvas, context)
  });
  redo.addEventListener('click', function() {
    //history.redo(canvas, context)
  });

  for (var i = 0; i < colors.length; i++){
    colors[i].addEventListener('click', onColorUpdate, false);
  }
  socket.on('drawing', onDrawingEvent);
  window.addEventListener('resize', onResize, false);
  onResize();

  function drawLine(x0, y0, x1, y1, color, emit){
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
    context.closePath();

    if (!emit) { return; }
    var w = canvas.width;
    var h = canvas.height;

    socket.emit('drawing', {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: color
    });
  }

  function onMouseDown(e){
    drawing = true;
    current.x = e.clientX;
    current.y = e.clientY;
  }

  function onMouseUp(e){
    if (!drawing) { return; }
    drawing = false;
    drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
    //store the line in an array
  }

  function onMouseMove(e){
    if (!drawing) { return; }
    drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
    current.x = e.clientX;
    current.y = e.clientY;
  }

  function onColorUpdate(e){
    current.color = e.target.className.split(' ')[1];
  }

  // limit the number of events per second
  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  function onDrawingEvent(data){
    var w = canvas.width;
    var h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
    //store line in array
  }

  // make the canvas fill its parent
  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

})();