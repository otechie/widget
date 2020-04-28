import html from './message.html';
import './message.css';

let elements = [];
let chat;
let iframe;
let body;
let x;
let icon;
let API_URL;
let WEB_URL;

export function show () {
  API_URL = window.ow.configurations.dev ? 'http://localhost:8000' : 'https://api.otechie.com'
  WEB_URL = window.ow.configurations.dev ? 'http://localhost:8080' : 'https://otechie.com'

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
  icon = document.getElementsByClassName('otechie-widget-icon')[0];

  chat.addEventListener('click', toggle);
  iframe.url = `${WEB_URL}/${window.ow.configurations.username}`
}

export function toggle () {
  iframe.hidden = !iframe.hidden
  icon.hidden = !icon.hidden
  x.hidden = !x.hidden
  chat.active = true
  iframe.contentWindow.focus()
}
