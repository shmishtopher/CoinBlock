const extractHost = url => url.indexOf('://') > -1 
  ? url.split('/')[2].split(':')[0].split('?')[0]
  : url.split('/')[0].split(':')[0].split('?')[0]

let appState = {}
fetch(chrome.runtime.getURL('../sources/disallow.txt'))
  .then(res => res.text())
  .then(res => res.split('\r\n'))
  .then(res => {
    chrome.webRequest.onBeforeRequest.addListener(details => {
      if (appState.paused) { return { cancel: false } }
      if (extractHost(details.url) in appState) { return { cancel: false } }
      else { return { cancel: true } } 
    }, {urls: res}, ['blocking'])
  })

chrome.runtime.onMessage.addListener((request, sender, sendRes) => {
  if ('toggle' in request) {
    chrome.storage.sync.get(null, res => {
      chrome.storage.sync.set({paused: !res.paused}, () => {
        chrome.tabs.query({active: true}, tabs => {
          sendRes({paused: !res.paused || false, whitelisted: (extractHost(tabs[0].url) in res) || false})
          appState = res
        })
      })
    })
  }

  if ('host' in request) {
    chrome.tabs.query({active: true}, tabs => {
      chrome.storage.sync.get(null, res => {
        sendRes({paused: res.paused || false, whitelisted: (extractHost(tabs[0].url) in res) || false})
        appState = res
      })
    })
  }

  if ('blacklist' in request) {
    chrome.tabs.query({active: true}, tabs => {
      chrome.storage.sync.remove(extractHost(tabs[0].url), () => {
        chrome.storage.sync.get(null, res => {
          sendRes({paused: res.paused || false, whitelisted: false})
          appState = res
        })
      })
    })
  }

  if ('whitelist' in request) {
    chrome.tabs.query({active: true}, tabs => {
      chrome.storage.sync.set({[extractHost(tabs[0].url)]: true}, () => {
        chrome.storage.sync.get(null, res => {
          sendRes({paused: res.paused || false, whitelisted: true})
          appState = res
        })
      })
    })
  }

  return true
})
