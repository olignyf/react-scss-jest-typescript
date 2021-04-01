enum EnvironmentType {
  DEBUG = 'debug',
  PROD = 'prod',
}

interface FrontendConfig {
  isDebug: boolean;
  isProduction: boolean;
  baseUrl: string;
}

/**
 * The `process.env.NODE_ENV` variable is a special variable "injected" by Webpack
 * at runtime. The word "injected" is in double quotes for a good reason. Indeed,
 * the variable is not really injected, it's really a search & replace at build time
 * that is performed by Webpack. Meaning on the final bundle, this code will look
 * like `return "production"` (assuming `process.env.NODE_ENV` equals `production`).
 */
const getBuildEnvironment = (): string => process.env.NODE_ENV;

const getAPIBaseURL = (): string => process.env.REACT_APP_BASE_API_URL ?? '';

const getEnvironmentType = (): EnvironmentType => {
  if (getBuildEnvironment() === 'production') {
    return EnvironmentType.PROD;
  }

  return EnvironmentType.DEBUG;
};

const computeConfig = (): FrontendConfig => {
  const buildType = getEnvironmentType();

  return {
    isDebug: buildType === EnvironmentType.DEBUG,
    isProduction: buildType === EnvironmentType.PROD,
    baseUrl: getAPIBaseURL()
  };
};

export const Config: Readonly<FrontendConfig> = computeConfig();
