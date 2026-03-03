export class BaseEmailProvider {
  constructor() {
    if (new.target === BaseEmailProvider) {
      throw new Error('BaseEmailProvider is abstract and cannot be instantiated directly');
    }
  }

  async authenticate() {
    throw new Error('authenticate() must be implemented by subclass');
  }

  async searchEmails(query) {
    throw new Error('searchEmails() must be implemented by subclass');
  }

  async getEmailDetails(emailId, token) {
    throw new Error('getEmailDetails() must be implemented by subclass');
  }

  extractUnsubscribeLink(email) {
    throw new Error('extractUnsubscribeLink() must be implemented by subclass');
  }

  async scanForSubscriptions() {
    throw new Error('scanForSubscriptions() must be implemented by subclass');
  }
}
