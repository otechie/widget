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
let input
let workspace = {};

export function show () {
  axios.get('http://localhost:8000/workspace/nuxt').then(result => {
    workspace = result.data
    document.getElementsByClassName('otechie-widget-workspace-name')[0].textContent = workspace.name;
    document.getElementsByClassName('otechie-widget-workspace-rate')[0].textContent = `$${workspace.hourlyRate / 100}.00 / hr`;
    document.getElementsByClassName('otechie-widget-avatar')[0].src = workspace.avatarUrl;
    input.placeholder = `Start chat with ${workspace.name}`;
  })
  let temporary = document.createElement('div');
  temporary.innerHTML = html;

  // append elements to body
  body = document.getElementsByTagName('body')[0];
  while (temporary.children.length > 0) {
    elements.push(temporary.children[0]);
    body.appendChild(temporary.children[0]);
  }
  chat = document.getElementsByClassName('otechie-widget-chat')[0];
  chat.addEventListener('click', toggle);
  input = document.getElementsByClassName('otechie-widget-textarea')[0]
  input.addEventListener('onkeydown', send);
}

export function toggle () {
  chat = document.getElementsByClassName('otechie-widget-chat')[0];
  chatbox = document.getElementsByClassName('otechie-widget-chatbox')[0];
  textarea = document.getElementsByClassName('otechie-widget-textarea')[0];
  x = document.getElementsByClassName('otechie-widget-x')[0];
  icon = document.getElementsByClassName('otechie-widget-icon')[0];
  chatbox.hidden = !chatbox.hidden
  icon.hidden = !icon.hidden
  x.hidden = !x.hidden
  chat.active = true
  textarea.focus()
}

export function send () {

  console.log('input.textContent', input.textContent)
  window.location.href = `https://dev-otechie.com/${workspace.username}?message=${input.textContent}`
}
