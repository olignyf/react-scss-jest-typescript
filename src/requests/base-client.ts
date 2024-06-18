import { ApisauceConfig, ApisauceInstance, create } from 'apisauce';
import { DEFAULT_CONFIG } from './api-client';

/**
 * This client is made to be composed with multiple controllers.
 */
export class BaseClient {
  protected api: ApisauceInstance;
  protected config: ApisauceConfig;

  constructor(config: ApisauceConfig) {
    const combinedConfig = {...DEFAULT_CONFIG, ...config};
    this.api = create(combinedConfig);
    this.config = combinedConfig;
  }
}
