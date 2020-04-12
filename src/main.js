import { show } from './views/message'

function app (window) {
  // set default configurations
  let configurations = {
    username: 'otechie-team'
  };

  // all methods that were called till now and stored in queue
  // needs to be called now
  let globalObject = window[window['JS-Widget']];

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
