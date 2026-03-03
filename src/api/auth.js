import { ApiClient } from './client.js';

export class AuthApi extends ApiClient {
  async register(email, password) {
    const response = await this.post('/auth/register', { email, password });
    
    if (response.success && response.token) {
      await this.setToken(response.token);
    }
    
    return response;
  }

  async login(email, password) {
    const response = await this.post('/auth/login', { email, password });
    
    if (response.success && response.token) {
      await this.setToken(response.token);
    }
    
    return response;
  }

  async logout() {
    await this.removeToken();
    return { success: true };
  }

  async getCurrentUser() {
    try {
      return await this.get('/auth/me');
    } catch (error) {
      await this.removeToken();
      throw error;
    }
  }

  async isAuthenticated() {
    const token = await this.getToken();
    if (!token) return false;

    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  }
}
