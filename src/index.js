import html from './widget.html'
import './widget.css'

let popup
let body
let index
let storedScroll = 0
let bubble
let avatar
let workspace

let onSubmittedFunction
let onLoadedFunction

let lastUrl = location.href
new MutationObserver(() => {
  if (location.href !== lastUrl && popup) {
    lastUrl = location.href
    popup.contentWindow.postMessage({
      message: 'LOADED_PAGE',
      href: location.href
    }, '*')
  }
}).observe(document, { subtree: true, childList: true })

function app (window) {
  index = document.createElement('div')
  index.id = 'otechie-widget'
  index.innerHTML = html

  body = document.getElementsByTagName('body')[0]
  body.appendChild(index)

  bubble = document.getElementsByClassName('OtechieWidget--bubble')[0]
  bubble.onclick = openVideo

  popup = document.getElementsByClassName('OtechieWidget--video')[0]
  avatar = document.getElementsByClassName('OtechieWidget--avatar')[0]

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
    case 'onLoaded':
      return onLoaded(args)
    case 'hide':
      return hide()
    case 'show':
      return show()
    case 'toggle':
      return toggle()
    case 'close':
      return close()
    case 'reset':
      return reset()
    case 'update':
      return popup.contentWindow.postMessage({ message: 'UPDATE' }, '*')
    default:
      return
  }
}

function init ({ username, account, workspace }) {
  index.classList.remove('OtechieWidget--hide')
  const teamId = account || username || workspace
  const url = `${process.env.APP_URL}/${teamId}?href=${encodeURIComponent(window.location.href)}`
  if (popup.src !== url) {
    index.classList.remove('OtechieWidget--loaded')
    popup.src = url
  }
}

function hide () {
  if (!index) return
  index.classList.remove('OtechieWidget--video-open')
  index.classList.add('OtechieWidget--hide')
}

function show () {
  if (!index) return
  index.classList.remove('OtechieWidget--hide')
}

function messageReceived (event) {
  if (event.origin !== process.env.APP_URL) return

  switch (event.data.message) {
    case 'CLOSE_VIDEO':
      return closeVideo()
    case 'OPEN_VIDEO':
      return openVideo()
    case 'TOGGLE':
      return toggle()
    case 'ON_SUBMITTED':
      if (!onSubmittedFunction) return
      return onSubmittedFunction(event.data)
    case 'LOADED':
      workspace = event.data.workspace
      if (workspace.users.length > 0) {
        avatar.src = workspace.users[0].avatarUrl
      }
      index.classList.add('OtechieWidget--loaded')
      event.source.postMessage({ message: 'LOADED_PAGE', href: window.location.href }, '*')
      if (onLoadedFunction) {
        onLoadedFunction()
      }
    default:
      return
  }
}

function toggle () {
  if (index.classList.contains('OtechieWidget--video-open')) {
    closeVideo()
  } else {
    openVideo()
  }
}

function openVideo () {
  storedScroll = window.scrollY
  index.classList.add('OtechieWidget--video-open')
  body.classList.add('OtechieWidget--lock')
  popup.contentWindow.focus()
  popup.contentWindow.postMessage({ message: 'PLAY' }, '*')
}

function closeVideo () {
  console.log('=== closeVideo')
  index.classList.remove('OtechieWidget--video-open')
  body.classList.remove('OtechieWidget--lock')
  window.scrollTo({
    top: storedScroll,
    left: 0,
    behavior: 'auto'
  })
}

function reset () {
  const url = popup.src
  popup.src = null
  index.classList.remove('OtechieWidget--loaded')
  popup.contentWindow.postMessage({ message: 'RESET' }, '*')
  popup.src = url
}

function submit (form) {
  return popup.contentWindow.postMessage({ message: 'SUBMIT', form }, '*')
}

function onSubmitted (args) {
  if (typeof args === 'function') {
    onSubmittedFunction = args
  } else {
    console.error('onSubmitted must be a function')
  }
}

function onLoaded (args) {
  if (typeof args === 'function') {
    onLoadedFunction = args
  } else {
    console.error('onLoaded must be a function')
  }
}

app(window)
