export class StorageService {
  constructor() {
    this.storage = chrome.storage.local;
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.storage.get([key], (result) => {
        if (chrome.runtime.lastError) {
          return reject(new Error(`Storage get error: ${chrome.runtime.lastError.message}`));
        }
        resolve(result[key]);
      });
    });
  }

  async set(key, value) {
    return new Promise((resolve, reject) => {
      this.storage.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          return reject(new Error(`Storage set error: ${chrome.runtime.lastError.message}`));
        }
        resolve();
      });
    });
  }

  async remove(key) {
    return new Promise((resolve, reject) => {
      this.storage.remove([key], () => {
        if (chrome.runtime.lastError) {
          return reject(new Error(`Storage remove error: ${chrome.runtime.lastError.message}`));
        }
        resolve();
      });
    });
  }

  async clear() {
    return new Promise((resolve, reject) => {
      this.storage.clear(() => {
        if (chrome.runtime.lastError) {
          return reject(new Error(`Storage clear error: ${chrome.runtime.lastError.message}`));
        }
        resolve();
      });
    });
  }

  async getSubscriptions() {
    return await this.get('subscriptions') || [];
  }

  async saveSubscriptions(subscriptions) {
    await this.set('subscriptions', subscriptions);
  }

  async getScanTimestamp() {
    return await this.get('lastScanTimestamp');
  }

  async setScanTimestamp(timestamp) {
    await this.set('lastScanTimestamp', timestamp);
  }
}
