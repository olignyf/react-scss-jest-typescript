import {
  ApiErrorResponse,
  ApiResponse,
  ApisauceConfig,
  ApisauceInstance,
} from 'apisauce';
import { AxiosRequestConfig } from 'axios';
import { sessionStore } from 'src/authentication/sessions-store';

import { NotificationVariant } from 'src/notifications/notification';
import { createAndDispatchNotification } from 'src/notifications/notification-helper';


export class GenericController {
  protected api: ApisauceInstance;
  protected config: ApisauceConfig;

  constructor(api: ApisauceInstance, config: ApisauceConfig) {
    this.api = api;
    this.config = config;
  }


  // This is used for simple 'get' and 'put' method that returns the APIResponse directly.
  // Currently it handles the 401 redirect.
  protected examinePromise<T>(promise: Promise<ApiResponse<T>>): Promise<ApiResponse<T>> {
    return promise.then((response: ApiResponse<T>) => {
      return this.examineResponseGenericHandler(response);
    });
  }

  // Will not throw on server-side errors
  protected examineResponseGenericHandler<T>(response: ApiResponse<T>): ApiResponse<T> {
    if (!response.ok) {
      this.handleSignedOutResponse(response);
    }

    return response;
  }

  protected handleSignedOutResponse<T>(response: ApiErrorResponse<T> | any): void {
    const { status } = response;

    if (status === 401) {
      if (sessionStore.authenticated) {
        createAndDispatchNotification(
          'Session has expired or is invalid. Please sign in again.',
          NotificationVariant.WARNING,
        );
      }
      sessionStore.logout(); // 401 handle 
    }
  }
  
  /**
  * This version returns back a Promise with ApiResponse so that layers above can access the HTTP status code.
  * It does examine the response and handles 401 unauthorized => redirect to login
  *
  * **/
 public get<T>(url: string, params?: object, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
   const response = this.api.get<T>(url, params, config);
   return this.examinePromise(response);
 }

 public put<T>(url: string, params?: object, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
   const response = this.api.put<T>(url, params, config);
   return this.examinePromise(response);
 }

 public delete<T>(url: string, params?: object, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
   const response = this.api.delete<T>(url, params, config);
   return this.examinePromise(response);
 }

 public post<T>(url: string, params?: object, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
   const response = this.api.post<T>(url, params, config);
   return this.examinePromise(response);
 }

 public upload<T>(
   url: string,
   params?: any,
   config?: AxiosRequestConfig,
   onUploadProgress?: (progressEvent: any) => void,
 ): Promise<ApiResponse<T, T>> {
   if (!config) {
     config = {};
   }
   config.headers = { 'Content-Type': 'multipart/form-data' };
   config.onUploadProgress = (e) => {
     if (e && e.total) {
       onUploadProgress?.(e);
     }
   };
   const formData = new FormData();
   Object.keys(params).forEach((el: any) => {
     formData.append(el, params[el]);
   });
   const response = this.api.post<T>(url, formData, config);
   return this.examinePromise(response);
 }
}
