chrome.runtime.onInstalled.addListener(() => {
  console.log('Mail Subscription Manager installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'LOG') {
    console.log('[Extension Log]:', request.data);
  }
  
  if (request.type === 'SCAN_COMPLETE') {
    console.log('[Scan Complete]:', request.data);
    
    chrome.action.setBadgeText({ 
      text: String(request.data.count || '') 
    });
    chrome.action.setBadgeBackgroundColor({ 
      color: '#667eea' 
    });
  }
  
  return true;
});

chrome.runtime.onStartup.addListener(() => {
  console.log('Mail Subscription Manager started');
});
