import html from './widget.html'
import './widget.css'

let iframe
let body
let widget
let bubble
let profileUrl

function app (window) {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      close()
    }
  })

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
      iframe.contentWindow.postMessage({ ...args, message: 'SET_COLOR' }, process.env.WEB_URL)
      return setColor(args)
    default:
      return
  }
}

function init ({ username, team }) {
  widget.classList.remove('OtechieWidget--hide')
  const teamId = team || username
  const url = `${process.env.WEB_URL}/${teamId}/widget`
  profileUrl = `${process.env.WEB_URL}/${teamId}`
  widget.classList.add('OtechieWidget--loaded')
}

function hide () {
  if (!widget) return
  widget.classList.remove('OtechieWidget--open')
  body.classList.remove('OtechieWidget--lock')
  widget.classList.add('OtechieWidget--hide')
}

function show () {
  if (!widget) return
  widget.classList.remove('OtechieWidget--hide')
}

function setColor ({ color }) {
  if (!bubble) return
  bubble.style.backgroundColor = color
}

function messageReceived (event) {
  if (event.origin !== process.env.WEB_URL) return

  switch (event.data.message) {
    case 'CLOSE_WIDGET':
      return close()
    case 'SET_COLOR':
      setColor(event.data)
      widget.classList.add('OtechieWidget--loaded')
      return event.source.postMessage({ message: 'LOAD_WIDGET', href: window.location.origin }, process.env.WEB_URL)
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
  if (profileUrl) {
    window.location = profileUrl
  }
}

function close () {
  widget.classList.remove('OtechieWidget--open')
  body.classList.remove('OtechieWidget--lock')
}

app(window)
