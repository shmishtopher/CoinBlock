const _get = key => JSON.parse(window.localStorage.getItem(key)) || false
const _set = (key, val) => window.localStorage.setItem(key, JSON.stringify(val || true))
const _rem = key => window.localStorage.removeItem(key)
const _switch = keys => key => keys[key]()

const urlToDomain = url => url.match(/:\/\/(.[^/]+)/)[1]
const contains = (arr, val) => (arr.indexOf(val) != -1) ? true : false
const getPage = () => new Promise((fulfill, reject) => {
  chrome.tabs.query({active: true}, tabs => {
    fulfill(tabs[0])
  })
})

const bootstrap = (() => {
  // Update tab domains as they change
  const activeTabs = []
  chrome.tabs.onUpdated.addListener((tabID, _, tab) => { activeTabs[tabID] = urlToDomain(tab.url) })
  chrome.tabs.onRemoved.addListener(tabID => { activeTabs[tabID] = null })

  // App state handlers
  chrome.runtime.onMessage.addListener((req, sender, res) => {
    _switch({
      'pause': () => { _set('paused', ); res()},
      'white': () => getPage().then(page => { _set(urlToDomain(page.url)); res({isPaused: _get('paused'), isWhitelist: true})}),
      'black': () => getPage().then(page => { _rem(urlToDomain(page.url)); res({isPaused: _get('paused'), isWhitelist: false})}),
      'stats': () => getPage().then(page => res({isPaused: _get('paused'), isWhitelist: _get(urlToDomain(page.url))}))
    })(req.is)
  })

  // Load blacklist and set block
  fetch(chrome.runtime.getURL('../sources/blacklist.txt'))
    .then(urls => urls.text())
    .then(urls => urls.split('\r\n'))
    .then(urls => {
      chrome.webRequest.onBeforeRequest.addListener(details => {
        if (_get('isPaused') || false) { return {cancel: false} }
        if (contains(_get('whitelist') || ['none'], urlToDomain(details.url))) { return {cancel: false} }
        return {cancel: true}
      }, {urls}, ['blocking'])
    })
    .catch(err => {
      console.log(err)
    })
})()