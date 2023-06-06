import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';

import { ENV_CONFIGS } from '../configs/configuration';

export async function dbConnectionFactory(
  configService: ConfigService,
): Promise<MongooseModuleFactoryOptions> {
  const dbUser = configService.get(ENV_CONFIGS.MONGODB_USER);
  const dbPassword = configService.get(ENV_CONFIGS.MONGODB_PASSWORD);
  const dbName = configService.get(ENV_CONFIGS.MONGODB_DATABASE_NAME);

  return {
    uri: `mongodb+srv://${dbUser}:${dbPassword}@${dbName}/?retryWrites=true&w=majority`,
    retryAttempts: configService.get(ENV_CONFIGS.MONGODB_RETRY_ATTEMPTS),
    retryDelay: configService.get(ENV_CONFIGS.MONGODB_RETRY_DELAY),
  };
}