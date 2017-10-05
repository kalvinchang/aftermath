var list = document.querySelectorAll('#HomeCheckList');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'IMG') {
    ev.target.src='assets/checked.svg';
  }
}, false);