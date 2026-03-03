import { ApiClient } from './client.js';

export class UserApi extends ApiClient {
  async getProfile() {
    return await this.get('/user/profile');
  }

  async getStatus() {
    return await this.get('/user/status');
  }
}
