// Element handles
const $pause = document.getElementById('pause')
const $whiteList = document.getElementById('whitelist')
const $blackList = document.getElementById('blacklist')
const $isPaused = document.getElementById('isPaused')
const $isBlacklisted = document.getElementById('isBlacklisted')

chrome.runtime.sendMessage({host: true}, res => {
  $isPaused.className = res.paused ? 'paused' : 'unpaused'
  $isBlacklisted.className = res.whitelisted ? 'whitelisted' : 'blacklisted'
})

$pause.addEventListener('click', () => {
  chrome.runtime.sendMessage({toggle: true}, res => {
    $isPaused.className = res.paused ? 'paused' : 'unpaused'
    $isBlacklisted.className = res.whitelisted ? 'whitelisted' : 'blacklisted'
  })
})

$whiteList.addEventListener('click', () => {
  chrome.runtime.sendMessage({whitelist: true}, res => {
    $isPaused.className = res.paused ? 'paused' : 'unpaused'
    $isBlacklisted.className = res.whitelisted ? 'whitelisted' : 'blacklisted'
  })
})

$blackList.addEventListener('click', () => {
  chrome.runtime.sendMessage({blacklist: true}, res => {
    $isPaused.className = res.paused ? 'paused' : 'unpaused'
    $isBlacklisted.className = res.whitelisted ? 'whitelisted' : 'blacklisted'
  })
})