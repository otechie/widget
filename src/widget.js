import html from './widget.html'
import './widget.css'

let iframe
let body
let widget
let bubble

function app (window) {
  const globalObject = window[window['Otechie-Widget']]
  const queue = globalObject.q
  if (queue && queue.length && queue[0].length > 1 && queue[0][1].username) {
    inject(queue[0][1].username)
  }
}

function inject (username) {
  widget = document.createElement('div')
  widget.id = 'otechie-widget'
  widget.innerHTML = html

  body = document.getElementsByTagName('body')[0]
  body.appendChild(widget)

  bubble = document.getElementsByClassName('OtechieWidget--bubble')[0]
  bubble.onclick = toggle

  iframe = document.getElementsByClassName('OtechieWidget--iframe')[0]
  iframe.src = `${process.env.WEB_URL}/${username}`
  window.onmessage = (event) => {
    if (event.origin === process.env.WEB_URL && event.data === 'close') {
      toggle()
    } else if (event.origin === process.env.WEB_URL && event.data && event.data.widgetColor) {
      bubble.style.backgroundColor = event.data.widgetColor
      widget.classList.add('OtechieWidget--loaded')
      event.source.postMessage({ type: 'widgetLoaded', href: window.location.href }, process.env.WEB_URL)
    }
  }
}

function toggle () {
  if (widget.classList.contains('OtechieWidget--open')) {
    widget.classList.remove('OtechieWidget--open')
    body.classList.remove('OtechieWidget--lock')
  } else {
    widget.classList.add('OtechieWidget--open')
    body.classList.add('OtechieWidget--lock')
    iframe.contentWindow.focus()
  }
}

app(window)
