fetch(chrome.runtime.getURL('../blacklist.txt'))
  .then(urls => urls.text())
  .then(urls => urls.split('\r\n'))
  .then(urls => {
    const store = new Store()
    store.setBlacklist(urls)

    chrome.runtime.onMessage.addListener((req, _, send) => {
      chrome.tabs.query({active:true}, tab => {
        switch (req.is) {
          case 'whitelist':
            store.addWhitelist(tab[0].url)
            break

          case 'blacklist':
            store.remWhitelist(tab[0].url)
            break

          case 'pause':
            store.togglePause()
            break

          default:
            break
        }
        send({pause: store.getPaused(), allow: store.isWhitelisted(tab[0].url)})
      })
      return true
    })

    chrome.webRequest.onBeforeRequest.addListener(details => {
      if (store.getPaused()) { return {cancel: false} }
      if (store.isWhitelisted(details.url)) { return {cancel: false} }
      return {cancel: true}
    }, {urls}, ['blocking'])
  })