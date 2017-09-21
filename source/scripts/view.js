const $isPaused = document.getElementById('isPaused')
const $isBlacklisted = document.getElementById('isBlacklisted')
const $pause = document.getElementById('pause')
const $whitelist = document.getElementById('whitelist')
const $blacklist = document.getElementById('blacklist')

const handleRes = res => {
  $isPaused.className = res.pause ? 'paused' : 'unpaused'
  $isBlacklisted.className = res.allow ? 'whitelisted' : 'blacklisted'
}

chrome.runtime.sendMessage({open: true}, handleRes)

$pause.addEventListener('click', () => chrome.runtime.sendMessage({is: 'pause'}, handleRes))
$whitelist.addEventListener('click', () => chrome.runtime.sendMessage({is: 'whitelist'}, handleRes))
$blacklist.addEventListener('click', () => chrome.runtime.sendMessage({is: 'blacklist'}, handleRes))