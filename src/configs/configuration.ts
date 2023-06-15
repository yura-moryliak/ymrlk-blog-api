export interface ConfigurationInterface {
  GLOBAL_API: string;
  CORS_ORIGIN: string;
  DEV_SSR_CORS: string;
  BASE_URL: string;
  MONGODB_CONNECTION_STRING: string;
  MONGODB_DATABASE_NAME: string;
  MONGODB_RETRY_ATTEMPTS: string;
  MONGODB_RETRY_DELAY: string;
  MONGODB_USER: string;
  MONGODB_PASSWORD: string;
  THROTTLE_TTL: string;
  THROTTLE_LIMIT: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  REFRESH_TOKEN_SIZE: string;
  REFRESH_TOKEN_EXPIRATION_DAYS: string;
}

export const ENV_CONFIGS: ConfigurationInterface = {
  GLOBAL_API: 'GLOBAL_API',
  CORS_ORIGIN: 'CORS_ORIGIN',
  DEV_SSR_CORS: 'DEV_SSR_CORS',
  BASE_URL: 'BASE_URL',
  MONGODB_CONNECTION_STRING: 'MONGODB_CONNECTION_STRING',
  MONGODB_DATABASE_NAME: 'MONGODB_DATABASE_NAME',
  MONGODB_RETRY_ATTEMPTS: 'MONGODB_RETRY_ATTEMPTS',
  MONGODB_RETRY_DELAY: 'MONGODB_RETRY_DELAY',
  MONGODB_USER: 'MONGODB_USER',
  MONGODB_PASSWORD: 'MONGODB_PASSWORD',
  THROTTLE_TTL: 'THROTTLE_TTL',
  THROTTLE_LIMIT: 'THROTTLE_LIMIT',
  JWT_SECRET: 'JWT_SECRET',
  JWT_EXPIRES_IN: 'JWT_EXPIRES_IN',
  REFRESH_TOKEN_EXPIRATION_DAYS: 'REFRESH_TOKEN_EXPIRATION_DAYS',
  REFRESH_TOKEN_SIZE: 'REFRESH_TOKEN_SIZE',
};
