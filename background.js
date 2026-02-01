// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'LOG') {
    // This prints to the background service worker console
    console.log('[Scanner Found]:', request.data);
  }
});

console.log("Background Service Worker Active.");