import { ApiClient } from './client.js';

export class SubscriptionApi extends ApiClient {
  async saveSubscriptions(subscriptions, emailsScanned, provider = 'gmail') {
    return await this.post('/subscriptions', {
      subscriptions,
      emailsScanned,
      provider
    });
  }

  async getSubscriptions() {
    return await this.get('/subscriptions');
  }

  async getScanHistory() {
    return await this.get('/subscriptions/history');
  }

  async markUnsubscribed(subscriptionId) {
    return await this.delete(`/subscriptions/${subscriptionId}`);
  }
}
