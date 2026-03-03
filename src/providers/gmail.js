import { BaseEmailProvider } from './base-provider.js';

export class GmailProvider extends BaseEmailProvider {
  constructor() {
    super();
    this.apiBase = 'https://gmail.googleapis.com/gmail/v1';
  }

  async authenticate() {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError) {
          return reject(new Error(`Authentication failed: ${chrome.runtime.lastError.message}`));
        }
        if (!token) {
          return reject(new Error('No authentication token received'));
        }
        resolve(token);
      });
    });
  }

  async searchEmails(query, token, maxResults = 50) {
    const url = `${this.apiBase}/users/me/messages?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;
    
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Gmail API search error: ${response.status} ${response.statusText} - ${body}`);
    }

    return await response.json();
  }

  async getEmailDetails(emailId, token) {
    const url = `${this.apiBase}/users/me/messages/${emailId}`;
    
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Gmail API details error: ${response.status} ${response.statusText} - ${body}`);
    }

    return await response.json();
  }

  extractUnsubscribeLink(headers) {
    if (!Array.isArray(headers)) {
      return null;
    }

    const unsubHeader = headers.find(h => h.name === 'List-Unsubscribe');
    
    if (!unsubHeader || !unsubHeader.value) {
      return null;
    }

    return this._parseUnsubscribeHeader(unsubHeader.value);
  }

  _parseUnsubscribeHeader(headerValue) {
    if (!headerValue) return null;

    const isValidHttpUrl = (str) => {
      try {
        const url = new URL(str);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        return false;
      }
    };

    const matches = headerValue.match(/<([^>]+)>/g);
    
    if (matches) {
      for (const match of matches) {
        const url = match.slice(1, -1);
        if (isValidHttpUrl(url)) {
          return url;
        }
      }
    }

    if (isValidHttpUrl(headerValue)) {
      return headerValue;
    }

    return null;
  }

  async scanForSubscriptions(options = {}) {
    const {
      maxResults = 50,
      maxSubscriptions = 20,
      daysBack = 30
    } = options;

    const uniqueSubs = new Map();

    try {
      const token = await this.authenticate();
      
      const query = `unsubscribe newer_than:${daysBack}d`;
      const searchResults = await this.searchEmails(query, token, maxResults);

      if (!searchResults.messages || searchResults.messages.length === 0) {
        return [];
      }

      for (const message of searchResults.messages) {
        if (uniqueSubs.size >= maxSubscriptions) {
          break;
        }

        const details = await this.getEmailDetails(message.id, token);
        const headers = details?.payload?.headers || [];

        if (headers.length === 0) {
          continue;
        }

        const unsubLink = this.extractUnsubscribeLink(headers);
        
        if (unsubLink) {
          const fromHeader = headers.find(h => h.name === 'From');
          const subjectHeader = headers.find(h => h.name === 'Subject');
          
          const rawFrom = fromHeader ? fromHeader.value : 'Unknown';
          const senderName = rawFrom.split('<')[0].trim().replace(/"/g, '') || 'Unknown Sender';
          const senderEmail = rawFrom.match(/<([^>]+)>/)?.[1] || rawFrom;

          if (!uniqueSubs.has(senderEmail)) {
            const subscription = {
              id: message.id,
              name: senderName,
              email: senderEmail,
              subject: subjectHeader ? subjectHeader.value : 'No Subject',
              unsubLink: unsubLink,
              provider: 'gmail'
            };

            uniqueSubs.set(senderEmail, subscription);
          }
        }
      }

      return Array.from(uniqueSubs.values());

    } catch (error) {
      console.error('Gmail scan error:', error);
      throw error;
    }
  }
}
