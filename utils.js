// utils.js

// 1. Auth Helper
export function getAuthToken() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ 'interactive': true }, (token) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(token);
    });
  });
}

// 2. Fetch Message Details
async function getMessageDetails(messageId, token) {
  const response = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gmail API error (getMessageDetails): ${response.status} ${response.statusText} - ${body}`);
  }
  return await response.json();
}

// 3. MAIN SCANNER
export async function scanForSubscriptions() {
  const uniqueSubs = new Map(); // Used to remove duplicates

  try {
    const token = await getAuthToken();
    
    // Log start
    chrome.runtime.sendMessage({ type: 'LOG', data: '--- Scan Started ---' });

    // Search for emails with 'unsubscribe' in the last 30 days
    const query = 'unsubscribe newer_than:30d'; 
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=50`, 
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Gmail API error (search): ${response.status} ${response.statusText} - ${body}`);
    }

    const data = await response.json();

    if (data.messages) {
      for (const message of data.messages) {
        
        // Optimization: Stop if we have enough unique items to show
        if (uniqueSubs.size >= 20) break;

        const details = await getMessageDetails(message.id, token);
        const headers = (details && details.payload && Array.isArray(details.payload.headers))
          ? details.payload.headers
          : [];

        if (headers.length === 0) continue;

        // Check if it's truly a subscription (has List-Unsubscribe header)
        const unsubHeader = headers.find(h => h.name === 'List-Unsubscribe');
        
        if (unsubHeader) {
          const fromHeader = headers.find(h => h.name === 'From');
          const subjectHeader = headers.find(h => h.name === 'Subject');
          
          // clean up sender name
          const rawFrom = fromHeader ? fromHeader.value : 'Unknown';
          const senderName = rawFrom.split('<')[0].trim().replace(/"/g, '');
          const senderEmail = rawFrom.match(/<(.*)>/)?.[1] || rawFrom;

          // DEDUPLICATION: Only process if we haven't seen this sender yet
          if (!uniqueSubs.has(senderName)) {
            
            const subObject = {
              id: message.id,
              name: senderName,
              email: senderEmail,
              subject: subjectHeader ? subjectHeader.value : 'No Subject',
              unsubLinks: unsubHeader.value
            };

            // Send FULL object to background console
            chrome.runtime.sendMessage({ type: 'LOG', data: subObject });

            // Add to our list
            uniqueSubs.set(senderName, subObject);
          }
        }
      }
    }

  } catch (error) {
    console.error(error);
    chrome.runtime.sendMessage({ type: 'LOG', data: `Error: ${error.message}` });
    throw error;
  }

  // Return just the values as an array
  return Array.from(uniqueSubs.values());
}