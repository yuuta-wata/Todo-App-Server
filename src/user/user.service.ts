import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entity/user.entity';
import { RegisterInput } from './inputs/registerInput';
import { LoginInput } from './inputs/loginInput';
import { AuthService } from '../auth/auth.service';
import { MyContext } from './myContext';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  // 全ユーザーを取得
  async users() {
    return await this.userRepository.find();
  }

  // ユーザー新規登録
  async register(registerData: RegisterInput) {
    try {
      await this.userRepository.create(registerData).save();
    } catch {
      console.log('ユーザーを登録出来ませんでした。');
      return false;
    }
    return true;
  }

  // ログイン
  async login(loginData: LoginInput, ctx: MyContext) {
    const user = await this.userRepository.findOne({
      where: { email: loginData.email },
    });
    // アクセストークンを生成
    const accessToken = await this.authService.createAccessToken(user);
    // Cookieに保存
    try {
      await this.authService.saveAccessToken(ctx.res, accessToken);
      return true;
    } catch {
      console.error('Cookieを追加出来ませんでした。');
      return false;
    }
  }
}
