import html from './message.html';
import './message.css';
import axios from 'axios'

let elements = [];
let chat;
let chatbox;
let body;
let textarea;
let x;
let icon;
let workspace = {};
let API_URL;
let WEB_URL;

export function show () {
  API_URL = window.ow.configurations.dev ? 'http://api.dev-otechie.com' : 'http://api.otechie.com'
  WEB_URL = window.ow.configurations.dev ? 'http://dev-otechie.com' : 'http://otechie.com'

  // append elements to body
  body = document.getElementsByTagName('body')[0];
  let temporary = document.createElement('div');
  temporary.innerHTML = html;
  while (temporary.children.length > 0) {
    elements.push(temporary.children[0]);
    body.appendChild(temporary.children[0]);
  }

  chat = document.getElementsByClassName('otechie-widget-chat')[0];
  chatbox = document.getElementsByClassName('otechie-widget-chatbox')[0];
  textarea = document.getElementsByClassName('otechie-widget-textarea')[0];
  x = document.getElementsByClassName('otechie-widget-x')[0];
  icon = document.getElementsByClassName('otechie-widget-icon')[0];

  textarea.addEventListener('keypress', keypress);
  chat.addEventListener('click', toggle);

  axios.get(`${API_URL}/workspace/${window.ow.configurations.username}`).then(result => {
    workspace = result.data
    document.getElementsByClassName('otechie-widget-workspace-name')[0].textContent = workspace.name;
    document.getElementsByClassName('otechie-widget-workspace-rate')[0].textContent = `$${workspace.hourlyRate / 100}.00 / hr`;
    document.getElementsByClassName('otechie-widget-avatar')[0].src = workspace.avatarUrl;
    textarea.placeholder = `Start chat with ${workspace.name}`;
  })
}

export function toggle () {
  chatbox.hidden = !chatbox.hidden
  icon.hidden = !icon.hidden
  x.hidden = !x.hidden
  chat.active = true
  textarea.focus()
}

export function keypress (event) {
  if (event.keyCode === 13) {
    console.log('input.textContent', textarea.value)
    window.location.href = `${WEB_URL}/${workspace.username}?message=${textarea.value}`
  }
}
