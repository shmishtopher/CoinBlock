const _get = key => JSON.parse(window.localStorage.getItem(key)) || false
const _set = (key, val) => window.localStorage.setItem(key, JSON.stringify(val || true))
const _rem = key => window.localStorage.removeItem(key)

const urlToDomain = url => url.match(/:\/\/(.[^/]+)/)[1]
const contains = (arr, val) => (arr.indexOf(val) != -1) ? true : false
const getPage = () => new Promise((fulfill, reject) => {
  chrome.tabs.query({active: true}, tabs => {
    fulfill(tabs[0].url)
  })
})

chrome.runtime.onMessage.addListener((req, _, res) => {
  switch (req.is) {
    case 'stats':
      res()
      break

    case 'white':
      res()
      break

    case 'black':
      res()
      break

    case 'toggle':
      res()
      break
  }
})

fetch(chrome.runtime.getURL('../sources/blacklist.txt'))
  .then(urls => urls.text())
  .then(urls => urls.split('\r\n'))
  .then(urls => {
    chrome.webRequest.onBeforeRequest.addListener(details => {
      if (_get('isPaused')) { return {cancel: false} }
      if (contains(_get('whitelist') || ['none'], urlToDomain(details.url))) { return {cancel: false} }
      return {cancel: true}
    }, {urls}, ['blocking'])
  })