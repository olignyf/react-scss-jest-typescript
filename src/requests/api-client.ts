import { ApisauceConfig, ApisauceInstance, create } from 'apisauce';
import https from 'https';
import { Config } from 'src/config';
import { RawController } from './raw-controller';
import { GenericController } from './generic-controller';


export const DEFAULT_CONFIG: ApisauceConfig = {
  baseURL: Config.baseUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
 /* httpsAgent: new https.Agent({
    rejectUnauthorized: Config.isDebug,
  }),*/
};


export class ApiClient {
  protected api: ApisauceInstance;
  protected config: ApisauceConfig;

  rawController: RawController;
  genericController: GenericController;

  constructor(config: ApisauceConfig) {
    const combinedConfig = {...DEFAULT_CONFIG, config};
    this.api = create(combinedConfig);
    this.config = combinedConfig;

    this.rawController = new RawController(this.api, this.config);
    this.genericController = new GenericController(this.api, this.config);
  }

  public setLanguageHeader(locale: string) {
    this.api.setHeader('Accept-Language', locale);
  }
}
