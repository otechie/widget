import html from './widget.html'
import './widget.css'

let iframe
let body
let widget

function inject () {
  body = document.getElementsByTagName('body')[0]
  const temporary = document.createElement('div')
  temporary.innerHTML = html
  while (temporary.children.length > 0) {
    body.appendChild(temporary.children[0])
  }
  widget = document.getElementById('otechie-widget')
  iframe = document.getElementsByClassName('ow-iframe')[0]
  const bubble = document.getElementsByClassName('ow-bubble')[0]

  bubble.addEventListener('click', toggle)
  iframe.src = `${process.env.WEB_URL}/${window.ow.config.username}`
  iframe.addEventListener('load', function (event) {
    widget.classList.add('ow-loaded')
  })
  window.addEventListener('message', function (event) {
    if (event.origin !== process.env.WEB_URL || event.data !== 'close') return
    toggle()
  })
}

function toggle () {
  if (widget.classList.contains('ow-open')) {
    widget.classList.remove('ow-open')
    body.classList.remove('ow-lock')
    iframe.contentWindow.blur()
  } else {
    iframe.hidden = false
    widget.classList.add('ow-open')
    body.classList.add('ow-lock')
    if (window.innerWidth > 767) {
      iframe.contentWindow.focus()
    }
  }
}

function app (window) {
  const globalObject = window[window['Otechie-Widget']]
  const queue = globalObject.q
  if (queue && queue.length && queue[0].length > 1 && queue[0][1].username) {
    globalObject.config = queue[0][1]
    inject()
  }
}

app(window)
