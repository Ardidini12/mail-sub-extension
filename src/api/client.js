export class ApiClient {
  constructor() {
    this.baseUrl = 'http://localhost:3000/api';
    this.storage = chrome.storage.local;
  }

  async getToken() {
    return new Promise((resolve) => {
      this.storage.get(['authToken'], (result) => {
        resolve(result.authToken || null);
      });
    });
  }

  async setToken(token) {
    return new Promise((resolve) => {
      this.storage.set({ authToken: token }, resolve);
    });
  }

  async removeToken() {
    return new Promise((resolve) => {
      this.storage.remove(['authToken'], resolve);
    });
  }

  async request(endpoint, options = {}) {
    const token = await this.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}
