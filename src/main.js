import { show } from './views/message'

function app (window) {
  // set default configurations
  let configurations = {
    username: 'otechie-team',
    dev: false
  };

  // all methods that were called till now and stored in queue
  // needs to be called now
  let globalObject = window[window['Otechie-Widget']];
  let queue = globalObject.q;
  if (queue) {
    for (var i = 0; i < queue.length; i++) {
      if (queue[i][0].toLowerCase() == 'init') {
        configurations = extendObject(configurations, queue[i][1]);
      }
    }
  }

  // override temporary (until the app loaded) handler
  // for widget's API calls
  globalObject.configurations = configurations;
  show();
}

function extendObject (a, b) {
  for (var key in b)
    if (b.hasOwnProperty(key))
      a[key] = b[key];
  return a;
}

app(window);
