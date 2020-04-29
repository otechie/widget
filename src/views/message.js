import html from './message.html'
import './message.css'

const WEB_URL = process.env.WEB_URL || 'http://localhost:8080'

let elements = []
let chat
let iframe
let body
let x
let mobileX
let icon

export function show () {
  body = document.getElementsByTagName('body')[0];
  let temporary = document.createElement('div');
  temporary.innerHTML = html;
  while (temporary.children.length > 0) {
    elements.push(temporary.children[0]);
    body.appendChild(temporary.children[0]);
  }
  chat = document.getElementsByClassName('otechie-widget-chat')[0];
  iframe = document.getElementsByClassName('otechie-widget-iframe')[0];
  x = document.getElementsByClassName('otechie-widget-x')[0];
  mobileX = document.getElementsByClassName('otechie-mobile-x')[0];
  icon = document.getElementsByClassName('otechie-widget-icon')[0];

  chat.addEventListener('click', toggle);
  mobileX.addEventListener('click', toggle);
  iframe.src = `${WEB_URL}/${window.ow.configurations.username}`
}

export function toggle () {
  iframe.hidden = !iframe.hidden
  icon.hidden = !icon.hidden
  x.hidden = !x.hidden
  mobileX.hidden = !mobileX.hidden
  chat.active = true
  iframe.contentWindow.focus()
}
