import { Routes } from '@nestjs/core';

import { AuthModule } from './repositories/auth/auth.module';
import { UsersModule } from './repositories/users/users.module';

export const routes: Routes = [
  {
    path: 'auth',
    module: AuthModule,
  },
  {
    path: 'users',
    module: UsersModule,
  },
];
