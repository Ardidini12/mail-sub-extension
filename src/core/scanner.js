import { GmailProvider } from '../providers/gmail.js';
import { StorageService } from './storage.js';

export class EmailScanner {
  constructor() {
    this.providers = {
      gmail: new GmailProvider()
    };
    this.storage = new StorageService();
    this.currentProvider = 'gmail';
  }

  setProvider(providerName) {
    if (!this.providers[providerName]) {
      throw new Error(`Provider ${providerName} not supported`);
    }
    this.currentProvider = providerName;
  }

  getProvider() {
    return this.providers[this.currentProvider];
  }

  async scan(options = {}) {
    try {
      const provider = this.getProvider();
      
      const subscriptions = await provider.scanForSubscriptions(options);
      
      await this.storage.saveSubscriptions(subscriptions);
      await this.storage.setScanTimestamp(Date.now());
      
      return {
        success: true,
        subscriptions,
        count: subscriptions.length,
        provider: this.currentProvider,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Scan error:', error);
      return {
        success: false,
        error: error.message,
        subscriptions: [],
        count: 0
      };
    }
  }

  async getStoredSubscriptions() {
    return await this.storage.getSubscriptions();
  }

  async getLastScanTime() {
    return await this.storage.getScanTimestamp();
  }

  async clearData() {
    await this.storage.clear();
  }
}
