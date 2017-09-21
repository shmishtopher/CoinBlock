class Store {
  constructor () {
    this.isPaused = JSON.parse(localStorage.getItem('isPaused')) || false
    this.blacklist = JSON.parse(localStorage.getItem('blacklist')) || []
    this.whitelist = JSON.parse(localStorage.getItem('whitelist')) || []
    this._observers = []
  }

  setBlacklist (arr) {
    this.blacklist = arr
  }

  setWhitelist (arr) {
    this.whitelist = arr
  }

  isBlacklisted (url) {
    return this.blacklist.indexOf(url.match(/:\/\/(.[^/]+)/)[0]) !== -1
  }
  
  isWhitelisted (url) {
    return this.whitelist.indexOf(url.match(/:\/\/(.[^/]+)/)[0]) !== -1
  }
  
  getPaused () {
    return this.isPaused
  }

  addWhitelist (url) {
    if (this.whitelist.indexOf(url.match(/:\/\/(.[^/]+)/)[0]) === -1) {
      this.whitelist.push(url.match(/:\/\/(.[^/]+)/)[0])
      localStorage.setItem('whitelist', JSON.stringify(this.whitelist))
    }
  }

  remWhitelist (url) {
    this.whitelist.splice(this.whitelist.indexOf(url.match(/:\/\/(.[^/]+)/)[0]), 1)
    localStorage.setItem('whitelist', JSON.stringify(this.whitelist))
  }

  togglePause () {
    this.isPaused = !this.isPaused
    localStorage.setItem('isPaused', JSON.stringify(this.isPaused))
  }

  addObserver (observer) {
    this._observers.push(observer)
  }
}