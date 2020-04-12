import html from './message.html';
import './message.css';

let elements = [];
let chat;
let chatbox;
let body;
let textarea;

export function show(text) {
    // convert plain HTML string into DOM elements
    let temporary = document.createElement('div');
    temporary.innerHTML = html;
    // temporary.getElementsByClassName('js-widget-dialog')[0].textContent = text;

    // append elements to body
    body = document.getElementsByTagName('body')[0];
    while (temporary.children.length > 0) {
        elements.push(temporary.children[0]);
        body.appendChild(temporary.children[0]);
    }
    chat = document.getElementsByClassName('otechie-widget-chat')[0];
    chat.addEventListener('click', open);
}

export function open() {
    chat = document.getElementsByClassName('otechie-widget-chat')[0];
    chatbox = document.getElementsByClassName('otechie-widget-chatbox')[0];
    textarea = document.getElementsByClassName('otechie-widget-textarea')[0];
    chatbox.hidden = !chatbox.hidden
    chat.active = true
    textarea.focus()
}
