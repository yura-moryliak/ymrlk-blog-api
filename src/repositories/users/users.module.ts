import { Module } from '@nestjs/common';

import { UsersService } from './services/users.service';
import { MongooseModule } from '@nestjs/mongoose';

import { SharedModule } from '../../shared/shared.module';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './controllers/users/users.controller';

@Module({
  controllers: [UsersController],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    SharedModule
  ],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
