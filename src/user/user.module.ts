import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { AuthModule } from '../auth/auth.module';
import { TodoModule } from 'src/todo/todo.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, TodoModule],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
