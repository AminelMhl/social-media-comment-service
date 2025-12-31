import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PostClient {
  private readonly logger = new Logger(PostClient.name);

  private get baseUrl(): string {
    return process.env.POST_SERVICE_URL || 'http://localhost:3002';
  }

  async getPostById(id: string): Promise<any | null> {
    try {
      const res = await axios.get(`${this.baseUrl}/posts/${id}`);
      return res.data;
    } catch (err) {
      this.logger.warn(`Failed to fetch post ${id}: ${err}`);
      return null;
    }
  }
}

