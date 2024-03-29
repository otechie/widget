import html from './widget.html'
import './widget.css'

let iframe
let body
let index
let storedScroll = 0
let bubble
let avatar
let workspace
let message

let onSubmittedFunction
let onLoadedFunction

let lastUrl = location.href
new MutationObserver(() => {
  if (location.href !== lastUrl && iframe) {
    lastUrl = location.href
    iframe.contentWindow.postMessage({
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
  bubble.onclick = openChat

  message = document.getElementsByClassName('OtechieWidget--message')[0]
  message.onclick = openChat

  let x = document.getElementsByClassName('OtechieWidget--x')[0]
  x.onclick = clearMessage

  iframe = document.getElementsByClassName('OtechieWidget--iframe')[0]
  avatar = document.getElementsByClassName('OtechieWidget--avatar')[0]

  window.onmessage = messageFromChat
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
      return iframe.contentWindow.postMessage({ message: 'UPDATE' }, '*')
    default:
      return
  }
}

function init ({ username, account, workspace }) {
  index.classList.remove('OtechieWidget--hide')
  const teamId = account || username || workspace
  const url = `${process.env.APP_URL}/${teamId}?href=${encodeURIComponent(window.location.href)}`
  if (iframe.src !== url) {
    index.classList.remove('OtechieWidget--loaded')
    iframe.src = url
  }
}

function hide () {
  if (!index) return
  index.classList.remove('OtechieWidget--chat-open')
  index.classList.add('OtechieWidget--hide')
}

function show () {
  if (!index) return
  index.classList.remove('OtechieWidget--hide')
}

function messageFromChat (event) {
  if (event.origin !== process.env.APP_URL) return

  switch (event.data.message) {
    case 'CLOSE_VIDEO':
      return closeChat()
    case 'OPEN_VIDEO':
      return openChat()
    case 'CLOSE_CHAT':
      return closeChat()
    case 'OPEN_CHAT':
      return openChat()
    case 'TOGGLE':
      return toggle()
    case 'SHOW_MESSAGE':
      return showMessage(event.data.text)
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

function clearMessage () {
  index.classList.remove('OtechieWidget--show-message')
}

function showMessage (text) {
  if (index.classList.contains('OtechieWidget--chat-open')) {
    return
  }
  if (typeof text === 'string') {
    message.innerHTML = text
    index.classList.add('OtechieWidget--show-message')
  } else {
    console.error('showMessage must be called with a string')
  }
}

function toggle () {
  if (index.classList.contains('OtechieWidget--chat-open')) {
    closeChat()
  } else {
    openChat()
  }
}

function openChat () {
  storedScroll = window.scrollY
  index.classList.add('OtechieWidget--chat-open')
  body.classList.add('OtechieWidget--lock')
  iframe.contentWindow.focus()
  clearMessage()
}

function closeChat () {
  index.classList.remove('OtechieWidget--chat-open')
  body.classList.remove('OtechieWidget--lock')
  window.scrollTo({
    top: storedScroll,
    left: 0,
    behavior: 'auto'
  })
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

function onLoaded (args) {
  if (typeof args === 'function') {
    onLoadedFunction = args
  } else {
    console.error('onLoaded must be a function')
  }
}

app(window)
