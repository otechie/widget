import html from './message.html';
import './message.css';
import axios from 'axios'

let elements = [];
let chat;
let chatbox;
let body;
let textarea;

export function show () {
  axios.get('http://localhost:8000/workspace/nuxt').then(result => {
    console.log(result)
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
}

export function toggle () {
  chat = document.getElementsByClassName('otechie-widget-chat')[0];
  chatbox = document.getElementsByClassName('otechie-widget-chatbox')[0];
  textarea = document.getElementsByClassName('otechie-widget-textarea')[0];
  chatbox.hidden = !chatbox.hidden
  chat.active = true
  textarea.focus()
}
