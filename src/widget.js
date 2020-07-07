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
  if (window.Otechie && window.Otechie.q) {
    window.Otechie.q.forEach(command => main(command[0], command[1]))
  }
  window.Otechie = main
}

function main (type, args) {
  switch (type) {
    case 'init': return init(args)
    case 'hide': return hide()
    case 'show': return show()
    default: return
  }
}

function init ({ username }) {
  widget.classList.remove('OtechieWidget--hide')
  if (iframe.src !== `${process.env.WEB_URL}/${username}`) {
    widget.classList.remove('OtechieWidget--loaded')
    iframe.src = `${process.env.WEB_URL}/${username}`
  }
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
