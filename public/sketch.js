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
  var socket = io();

  var canvas = document.getElementsByClassName('whiteboard')[0];
  var colors = document.getElementsByClassName('color');
  var thick = document.getElementById('thickness-slider');
  var papers = document.getElementsByClassName('paper');

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
  var annotationTool = document.getElementsByClassName('annotations tool')[0];
  var annotating = true;

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

  //tools
  for (var i = 0; i < colors.length; i++){
    colors[i].addEventListener('click', onColorUpdate, false);
  }
  thick.addEventListener('input', onThickUpdate, false);
  for (var i = 0; i < papers.length; i++){
    papers[i].addEventListener('click', onPaperUpdate, false);
  }

  var div = document.getElementById('rectangle-select');
  var x2, y2, x3, y3;

  socket.on('drawing', onDrawingEvent);
  socket.on('annotate', onAnnotationEvent);
  window.addEventListener('resize', onResize, false);
  onResize();

  //make colors collapsible
  var colortrack = true;
  var currentColor = document.getElementById('currentColor');
  currentColor.addEventListener('click', function(){
    if (colortrack) {
      for (var i = 0; i < colors.length; i++){
        colors[i].style.visibility = 'inherit';
      }
    } else {
      for (var i = 0; i < colors.length; i++){
        colors[i].style.visibility = 'hidden';
      }
    }
    colortrack = !colortrack;
  });

  //make paper collapsible
  var papertrack = true;
  var currentPaper = document.getElementById('currentPaper');
  currentPaper.addEventListener('click', function() {
    if (papertrack) {
      for (var i = 0; i < papers.length; i++) {
        console.log(papers[i]);
        papers[i].style.visibility = 'inherit';
      }
    }
    else {
      for (var i = 0; i < papers.length; i++) {
        papers[i].style.visibility = 'hidden';
      }
    }
    papertrack = !papertrack;
  });

  /*
  annotation tool
    1. click annotation tool - switch to a cross
    2. freeze the screen
    3. turn cursor into a pencil?? - Darien will make the graphic
    4. user interface for entering in comments (text)
    5. the text shows up on the annotations tab (w/ a check / uncheck button) - similar to Google Docs
      * computer generates a <div> for the annotation
    * cannot affect drawing
    * must show up on the annotations tab
  */
  annotationTool.addEventListener('click', function(){
      annotating = annotationTool.style.backgroundImage == 'url("assets/annotationCheck.svg")';
      if(annotating){
        console.log('working');
        annotationTool.style.backgroundImage = 'url("assets/annotationTool.svg")';
        annotating = false;
        canvas.classList.remove('crosshair');
      }
      else{
        annotationTool.style.backgroundImage = 'url("assets/annotationCheck.svg")';
        canvas.classList.add('crosshair');
      }
  });

  function rectSelectRestyle() {
    var xMin = Math.min(x2, x3);
    var xMax = Math.max(x2, x3);
    var yMin = Math.min(y2, y3);
    var yMax = Math.max(y2, y3);
    div.style.left = xMin + 'px';
    div.style.top = yMin + 'px';
    div.style.width = (xMax - xMin) + 'px';
    div.style.height = (yMax - yMin) + 'px';
  }

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

  function annotate(x0, y0, x1, y1, text, emit) {
    context.fillStyle = '#c41230';
    context.globalAlpha = 0.40;
    context.fillRect(x0, y0, Math.abs(x1 - x0), Math.abs(y1 - y0));
    context.globalAlpha = 1;

    if(!emit) { return; }

    //if it's an annotation coming from the server, use a diff method to display the text?

    var w = canvas.width;
    var h = canvas.height;

    var annotationInput = prompt("Enter your annotation", ""); //replace w/ user interface
    var li;
    if(annotationInput == null) { 
      return;
    } 
    else if (annotationInput == "") {
      li = jQuery('<li> Empty text </li>');
    }
    else {
      li = jQuery('<li>' + annotationInput + ' </li>');
    }
    jQuery('#notations').append(li);

    socket.emit('annotate', {   //only send the final rectangle!
      x0: x0 / w,
      x1: x1 / w,
      y0: y0 / h,
      y1: y1 / h,
      text: annotationInput,
    });
  }

  function onMouseDown(e){
    drawing = true;
    current.x = e.clientX;
    current.y = e.clientY;
    if (annotating) {
      div.hidden = 0;         //unhide rect select
      x2 = e.clientX;         //initial pos of rect select
      y2 = e.clientY;
      rectSelectRestyle();
    }
  }

  function onMouseUp(e){
    if (!drawing) { return; }
    annotating = annotationTool.style.backgroundImage == 'url("assets/annotationCheck.svg")';
    if(!annotating) {
      drawLine(current.x, current.y, e.clientX, e.clientY, current.color, current.thickness, true);
      current.x = e.clientX;
      current.y = e.clientY;
    } else {
      annotate(current.x, current.y, e.clientX, e.clientY, "", true);
      div.hidden = 1;
    }
    drawing = false;
  }

  function onMouseMove(e) {
    if (!drawing) { return; }
    annotating = annotationTool.style.backgroundImage == 'url("assets/annotationCheck.svg")';
    if (!annotating) { //if not annotating, then draw regularly
      drawLine(current.x, current.y, e.clientX, e.clientY, current.color, current.thickness, true);
      current.x = e.clientX;
      current.y = e.clientY;
    }
    else {
      x3 = e.clientX;         //final pos of rect select
      y3 = e.clientY;
      rectSelectRestyle();
    }
  }

  function onColorUpdate(e){
    current.color = e.target.className.split(' ')[1];
    if (current.color == 'green') {
      current.color = '#00ff00';;
    }
    currentColor.style.background = current.color;
    //immediately close after clicking on color
    for (var i = 0; i < colors.length; i++){
      colors[i].style.visibility = 'hidden';
      colortrack = !colortrack;
    }
  }

  function onThickUpdate(e){
    current.thickness = e.target.value;
  }

  function onPaperUpdate(e) {
    current.paper = e.target.className.split(' ')[1];
    if (current.paper == 'plain') {
      canvas.style.background = 'none';
      currentPaper.style.background = '#F1F1F1';
    }
    else {
      canvas.style.backgroundImage = 'url(assets/' + current.paper + '.png)';
      currentPaper.style.backgroundImage = 'url(assets/' + current.paper + '.png)'
    }
    //immediately close after clicking on paper
    for (var i = 0; i < papers.length; i++) {
      papers[i].style.visibility = 'hidden';
      papertrack = !papertrack;
    }
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

  function onDrawingEvent(data){    //processes drawing events from the server
    var w = canvas.width;
    var h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color, data.thickness);
    //store line in array
  }

  function onAnnotationEvent(data){   //processes annotations from the server
    var w = canvas.width;
    var h = canvas.height;
    console.log('annotation from the server');
    //display annotation
    annotate(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.text);
    //display text on the side
    var li;
    if(data.text == null || data.text  == "") {
      li = jQuery('<li> Empty text </li>');
    }
    else {
      li = jQuery('<li>' + data.text + ' </li>');
    }
    jQuery('#annotations').append(li);
  }

  // make the canvas fill its parent
  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
})();
