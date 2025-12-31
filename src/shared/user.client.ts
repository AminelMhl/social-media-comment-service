import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class UserClient {
  private readonly logger = new Logger(UserClient.name);

  private get baseUrl(): string {
    return process.env.USER_SERVICE_URL || 'http://localhost:3001';
  }

  async getUserById(id: string): Promise<any | null> {
    try {
      const res = await axios.get(`${this.baseUrl}/users/${id}`);
      return res.data;
    } catch (err) {
      this.logger.warn(`Failed to fetch user ${id}: ${err}`);
      return null;
    }
  }
}

