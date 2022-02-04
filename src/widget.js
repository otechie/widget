import html from './widget.html'
import './widget.css'

let iframe
let body
let widget
let bubble

function app (window) {
  widget = document.createElement('div')
  widget.id = 'otechie-widget'
  widget.innerHTML = html

  body = document.getElementsByTagName('body')[0]
  body.appendChild(widget)

  bubble = document.getElementsByClassName('OtechieWidget--bubble')[0]
  bubble.onclick = toggle

  iframe = document.getElementsByClassName('OtechieWidget--iframe')[0]
  window.onmessage = messageReceived
  const otechie = window.Otechie || window.ow
  if (otechie && otechie.q) {
    otechie.q.forEach(command => main(command[0], command[1]))
  }
  window.Otechie = main
  window.ow = main
}

function main (type, args) {
  switch (type) {
    case 'init':
      return init(args)
    case 'hide':
      return hide()
    case 'show':
      return show()
    case 'open':
      return open()
    case 'close':
      return close()
    case 'setColor':
      iframe.contentWindow.postMessage({ ...args, message: 'SET_COLOR' }, '*')
      return setColor(args)
    default:
      return
  }
}

function init ({ username, account }) {
  widget.classList.remove('OtechieWidget--hide')
  const teamId = account || username
  const url = `${process.env.APP_URL}/${teamId}/widget`
  if (iframe.src !== url) {
    widget.classList.remove('OtechieWidget--loaded')
    iframe.src = url
  }
}

function setColor ({ color }) {
  if (!bubble) return
  bubble.style.backgroundColor = color
}

function hide () {
  if (!widget) return
  widget.classList.remove('OtechieWidget--open')
  widget.classList.add('OtechieWidget--hide')
}

function show () {
  if (!widget) return
  widget.classList.remove('OtechieWidget--hide')
}

function messageReceived (event) {
  if (event.origin !== process.env.WEB_URL && event.origin !== process.env.APP_URL) return

  switch (event.data.message) {
    case 'CLOSE_WIDGET':
      return close()
    case 'SET_COLOR':
      bubble.style.backgroundColor = event.data.color
      if (event.data.height) {
        iframe.style.height = `${event.data.height}px`
      }
      widget.classList.add('OtechieWidget--loaded')
      return event.source.postMessage({ message: 'LOAD_WIDGET', href: window.location.origin }, '*')
    default:
      return
  }
}

function toggle () {
  if (widget.classList.contains('OtechieWidget--open')) {
    close()
  } else {
    open()
  }
}

function open () {
  widget.classList.add('OtechieWidget--open')
  iframe.contentWindow.focus()
}

function close () {
  widget.classList.remove('OtechieWidget--open')
}

app(window)
