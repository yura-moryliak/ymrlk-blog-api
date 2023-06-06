import { Module } from '@nestjs/common';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './repositories/auth/auth.module';
import { UsersModule } from './repositories/users/users.module';
import { JwtAuthGuard } from './repositories/auth/guards/jwt-auth.guard';

import { dbConnectionFactory } from './factories/db-connection.factory';
import { throttlerConfigFactory } from './factories/throttler-config.factory';
import { SharedModule } from './shared/shared.module';
import { routes } from './routes';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: dbConnectionFactory,
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: throttlerConfigFactory,
      inject: [ConfigService],
    }),
    RouterModule.register(routes),
    AuthModule,
    UsersModule,
    SharedModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
