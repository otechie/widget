import html from './widget.html'
import './widget.css'

let iframe
let body
let index
let bubble
let onSubmittedFunction

function app (window) {
  index = document.createElement('div')
  index.id = 'otechie-widget'
  index.innerHTML = html

  body = document.getElementsByTagName('body')[0]
  body.appendChild(index)

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
    case 'submit':
      return submit(args)
    case 'onSubmitted':
      return onSubmitted(args)
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
  index.classList.remove('OtechieWidget--hide')
  const teamId = account || username || workspace
  const url = `${process.env.APP_URL}/${teamId}/widget`
  if (iframe.src !== url) {
    index.classList.remove('OtechieWidget--loaded')
    iframe.src = url
  }
}

function setColor ({ color }) {
  if (!bubble) return
  bubble.style.backgroundColor = color
}

function hide () {
  if (!index) return
  index.classList.remove('OtechieWidget--open')
  index.classList.add('OtechieWidget--hide')
}

function show () {
  if (!index) return
  index.classList.remove('OtechieWidget--hide')
}

function messageReceived (event) {
  if (event.origin !== process.env.APP_URL) return

  switch (event.data.message) {
    case 'OPEN':
      return open()
    case 'CLOSE':
      return close()
    case 'CLOSE_WIDGET':
      return close()
    case 'TOGGLE':
      return toggle()
    case 'ON_SUBMITTED':
      if (!onSubmittedFunction) return
      return onSubmittedFunction(event.data)
    case 'SET_COLOR':
      bubble.style.backgroundColor = event.data.color
      index.classList.add('OtechieWidget--loaded')
      return event.source.postMessage({ message: 'LOAD_WIDGET', href: window.location.origin }, '*')
    default:
      return
  }
}

function toggle () {
  if (index.classList.contains('OtechieWidget--open')) {
    close()
  } else {
    open()
  }
}

function open (args) {
  const delay = args && args.delay ? args.delay : 0
  setTimeout(function () {
    index.classList.add('OtechieWidget--open')
    body.classList.add('OtechieWidget--lock')
    iframe.contentWindow.focus()
  }, delay)
}

function close () {
  index.classList.remove('OtechieWidget--open')
  body.classList.remove('OtechieWidget--lock')
}

function reset () {
  const url = iframe.src
  iframe.src = null
  index.classList.remove('OtechieWidget--loaded')
  iframe.contentWindow.postMessage({ message: 'RESET' }, '*')
  iframe.src = url
}

function submit (form) {
  return iframe.contentWindow.postMessage({ message: 'SUBMIT', form }, '*')
}

function onSubmitted (args) {
  if (typeof args === 'function') {
    onSubmittedFunction = args
  } else {
    console.error('onSubmitted must be a function')
  }
}

app(window)
