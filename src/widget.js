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
    for (var i = 0; i < queue.length; i++) {
      const command = queue[i]
      ow(command[0], command[1])
    }
  }
  window[window['Otechie-Widget']] = ow
}

function ow (type, args) {
  if (type === 'init') {
    init(args)
  } else if (type === 'hide') {
    hide()
  }
}

function hide () {
  if (widget) {
    widget.parentNode.removeChild(widget)
  }
}

function init ({ username, testMode }) {
  widget = document.createElement('div')
  widget.id = 'otechie-widget'
  widget.innerHTML = html

  body = document.getElementsByTagName('body')[0]
  body.appendChild(widget)

  bubble = document.getElementsByClassName('OtechieWidget--bubble')[0]
  bubble.onclick = toggle

  iframe = document.getElementsByClassName('OtechieWidget--iframe')[0]
  iframe.src = `${process.env.WEB_URL}/${username}${testMode ? '?test=true' : ''}`

  window.onmessage = messageReceived
}

function messageReceived (event) {
  if (event.origin !== process.env.WEB_URL) return

  switch (event.data.message) {
    case 'CLOSE_WIDGET':
      return toggle()
    case 'SET_COLOR':
      bubble.style.backgroundColor = event.data.color
      widget.classList.add('OtechieWidget--loaded')
      return event.source.postMessage({ message: 'LOAD_WIDGET', href: window.location.href }, process.env.WEB_URL)
    default:
      return
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
