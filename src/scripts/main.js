const _get = key => JSON.stringify(window.localStorage.getItem(key))
const _put = (key, val) => window.localStorage.setItem(key, JSON.stringify(val))

const urlToDomain = url => url.match(/:\/\/(.[^/]+)/)[1]
const contains = (arr, val) => (arr.indexOf(val) != -1) ? true : false

(() => {
  // Update tab domains as they change
  const activeTabs = []
  chrome.tabs.onUpdated.addListener((tabID, _, tab) => { activeTabs[tabID] = urlToDomain(tab.url) })
  chrome.tabs.onRemoved.addListener(tabID => { activeTabs[tabID] = null })

  // Load blacklist from ../sources and set block
  fetch(chrome.runtime.getURL('../sources/blacklist.txt'))
    .then(urls => urls.text())
    .then(urls => urls.split('\r\n'))
    .then(urls => {
      chrome.webRequest.onBeforeRequest.addListener(details => {
        if (_get('isPaused')) { return {cancel: false} }
        if (contains(_get('whitelist'), urlToDomain(details.url))) { return {cancel: false} }
        return {cancel: true}
      }, {urls}, ['blocking'])
    })
    .catch(err => {
      console.log(err)
    })
})()