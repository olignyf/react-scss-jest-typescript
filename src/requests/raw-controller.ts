import { ApiResponse } from 'apisauce';
import { AxiosRequestConfig } from 'axios';
import { GenericController } from './generic-controller';

export class RawController extends GenericController {
  /**
   * This version returns back a Promise with ApiResponse so that layers above can access the HTTP status code.
   * It does examine the response and handles 401 unauthorized => redirect to login
   *
   * **/
  public get<T>(url: string, params?: object, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = this.api.get<T>(url, params, config);
    return response;
  }

  public put<T>(url: string, params?: object, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = this.api.put<T>(url, params, config);
    return response;
  }

  public delete<T>(url: string, params?: object, config?: AxiosRequestConfig): Promise<ApiResponse<T,T>> {
    const response = this.api.delete<T>(url, params, config);
    return response;
  }

  public post<T>(url: string, params?: object, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = this.api.post<T>(url, params, config);
    return response;
  }

  public upload<T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    if (!config) {
      config = {};
    }
    config.headers = { 'Content-Type': 'multipart/form-data' };
    const formData = new FormData();
    Object.keys(params).forEach((el: any) => {
      formData.append(el, params[el]);
    });
    const response = this.api.post<T>(url, formData, config);
    return response;
  }
}
