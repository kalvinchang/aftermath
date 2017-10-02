/*adapted from: https://socketio-whiteboard.now.sh/
Copyright (c) 2014-2017 Automattic <dev@cloudup.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

'use strict';

(function() {
  var tool; //take out if unused
  var socket = io();
  //DOM
  var canvas = document.getElementsByClassName('whiteboard')[0];
  var colors = document.getElementsByClassName('color');
  var thick = document.getElementById('thickness-slider');
  var papers = document.getElementsByClassName('papers');
  var currentColor = document.getElementsByClassName('currentColor')[0];

  var context = canvas.getContext('2d');
  var undo = document.getElementById('undo');
  var redo = document.getElementById('redo');

  //object to store current settings
  var current = {
    color: 'black',
    thickness: 2,
    paper: 'plain'
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
  thick.addEventListener('input', onThickUpdate, false);
  for (var i = 0; i < papers.length; i++){
    papers[i].addEventListener('click', onPaperUpdate, false);
  }

  socket.on('drawing', onDrawingEvent);
  window.addEventListener('resize', onResize, false);
  onResize();

  //switch paper
  var papers = ['plain', 'assets/graph.png', 'assets/lined.jpg'];
  //make colors collapsible
  var colorBar = document.getElementById('colorBar');
  //clicking on current-color -> display the colors horizontally (unhide)
  var barDisplay = true;
  currentColor.onclick = function() {
    barDisplay = !barDisplay;
    if (barDisplay) {
      colorBar.style.display = 'none';
    } else {
      colorBar.style.display = 'inline-flex';
    }
  }
  // for (var i = 0; i < color.length; i++) {
  //  color[i].onclick = function() {
  //    this.classList.toggle('active');
  //  }
  // }



  function drawLine(x0, y0, x1, y1, color, thickness, emit){
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = thickness;
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
      color: color,
      thickness: thickness
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
    drawLine(current.x, current.y, e.clientX, e.clientY, current.color, current.thickness, true);
    //store the line in an array
  }

  function onMouseMove(e){
    if (!drawing) { return; }
    drawLine(current.x, current.y, e.clientX, e.clientY, current.color, current.thickness, true);
    current.x = e.clientX;
    current.y = e.clientY;
  }

  function onColorUpdate(e){
    current.color = e.target.className.split(' ')[1];
    currentColor.style.background = current.color;
  }

  function onThickUpdate(e){
    current.thickness = e.target.value; 
  }  

  function onPaperUpdate(e) {
    current.paper = e.target.className.split(' ')[1];
    if (current.paper == 'plain') {
      canvas.style.background = 'none';
    }
    else {
      canvas.style.backgroundImage = 'url(assets/' + current.paper + '.png)';
    }

    //.addEventListener('click', onPaperUpdate('white'), false);
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
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color, data.thickness);
    //store line in array
  }

  // make the canvas fill its parent
  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

})();