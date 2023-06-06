import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions } from '@nestjs/throttler/dist/throttler-module-options.interface';
import { ENV_CONFIGS } from '../configs/configuration';

export async function throttlerConfigFactory(
  configService: ConfigService,
): Promise<ThrottlerModuleOptions> {
  return {
    ttl: configService.get(ENV_CONFIGS.THROTTLE_TTL),
    limit: configService.get(ENV_CONFIGS.THROTTLE_LIMIT),
  };
}
