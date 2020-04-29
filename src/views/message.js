import html from './message.html'
import './message.css'

const WEB_URL = process.env.WEB_URL || 'https://dev-otechie.com'

let elements = []
let bubble
let iframe
let body
let x
let mobileX
let icon
let widget

export function show () {
  body = document.getElementsByTagName('body')[0];
  let temporary = document.createElement('div');
  temporary.innerHTML = html;
  while (temporary.children.length > 0) {
    elements.push(temporary.children[0]);
    body.appendChild(temporary.children[0]);
  }
  widget = document.getElementById('otechie-widget');
  bubble = document.getElementsByClassName('otechie-widget-bubble')[0];
  iframe = document.getElementsByClassName('otechie-widget-iframe')[0];
  x = document.getElementsByClassName('otechie-widget-x')[0];
  mobileX = document.getElementsByClassName('otechie-mobile-x')[0];
  icon = document.getElementsByClassName('otechie-widget-icon')[0];

  bubble.addEventListener('click', toggle);
  mobileX.addEventListener('click', toggle);
  iframe.src = `${process.env.WEB_URL}/${window.ow.configurations.username}`
}

export function toggle () {
  const hide = !iframe.hidden

  if (window.innerWidth <= 767) {
    mobileX.hidden = hide
    body.style.overflowY = iframe.hidden ? 'visible' : 'hidden'
    body.style.position = iframe.hidden ? 'relative' : 'fixed'
  }
  if (widget.classList.contains('fade')) {
    widget.classList.remove('fade')
    widget.classList.add('show')
    body.classList.add('lock')
    iframe.contentWindow.focus()
  } else {
    widget.classList.remove('show')
    widget.classList.add('fade')
    body.classList.remove('lock')
    iframe.contentWindow.blur()
  }
}
