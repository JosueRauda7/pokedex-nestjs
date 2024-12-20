import axios, { AxiosStatic } from 'axios';
import { HttpAdapter } from '../interfaces/http-adapter.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AxiosAdapter implements HttpAdapter {
  private axios: AxiosStatic = axios;

  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(url);
      return data as T;
    } catch (error) {
      console.log(error);
      throw new Error('Error on request - Check the logs');
    }
  }
}
