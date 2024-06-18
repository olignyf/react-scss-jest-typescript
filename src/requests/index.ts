import { Config } from 'src/config';
import { ApiClient } from './api-client';


export const apiClient = new ApiClient({
  baseURL: Config.baseUrl,
  withCredentials: true,
});
