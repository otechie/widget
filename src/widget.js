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
  const otechie = window.Otechie
  if (otechie && otechie.q) {
    otechie.q.forEach(command => main(command[0], command[1]))
  }
  window.Otechie = main
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
      return open(args)
    case 'toggle':
      return toggle()
    case 'close':
      return close()
    case 'reset':
      return reset()
    case 'setColor':
      return setColor(args)
    case 'update':
      return iframe.contentWindow.postMessage({ message: 'UPDATE' }, '*')
    default:
      return
  }
}

function init ({ username, account, workspace }) {
  widget.classList.remove('OtechieWidget--hide')
  const teamId = account || username || workspace
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

function open (args) {
  const delay = args && args.delay ? args.delay : 0
  setTimeout(function () {
    widget.classList.add('OtechieWidget--open')
    body.classList.add('OtechieWidget--lock')
    iframe.contentWindow.focus()
  }, delay)
}

function close () {
  widget.classList.remove('OtechieWidget--open')
  body.classList.remove('OtechieWidget--lock')
}

function reset () {
  const url = iframe.src
  iframe.src = null
  widget.classList.remove('OtechieWidget--loaded')
  iframe.contentWindow.postMessage({ message: 'RESET' }, '*')
  iframe.src = url
}

app(window)
