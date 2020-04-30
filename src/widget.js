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
  bubble.addEventListener('click', toggle)

  iframe = document.getElementsByClassName('OtechieWidget--iframe')[0]
  iframe.src = `${process.env.WEB_URL}/${username}`
  iframe.addEventListener('load', (event) => {
    widget.classList.add('OtechieWidget--loaded')
  })
  window.addEventListener('message', (event) => {
    if (event.origin === process.env.WEB_URL && event.data === 'close') {
      widget.classList.remove('OtechieWidget--open')
      body.classList.remove('OtechieWidget--lock')
    }
  })
}

function toggle () {
  if (widget.classList.contains('OtechieWidget--open')) {
    widget.classList.remove('OtechieWidget--open')
    body.classList.remove('OtechieWidget--lock')
  } else {
    widget.classList.add('OtechieWidget--open')
    if (window.innerWidth > 767) {
      iframe.contentWindow.focus()
    } else {
      body.classList.add('OtechieWidget--lock')
    }
  }
}

app(window)
