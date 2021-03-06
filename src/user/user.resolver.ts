import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';

import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { RegisterInput } from './inputs/registerInput';
import { MyContext } from './myContext';
import { GetToken } from '../customDecorator/getToken';
import { AuthService } from '../auth/auth.service';
import { DeleteAccountInput } from './inputs/deleteAccountInput';
import { TodoService } from '../todo/todo.service';
import { LoginInput } from './inputs/loginInput';
import { TokenDto } from './dto/token.dto';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly todoService: TodoService,
  ) {}

  @Query(() => [UserDto])
  async getUsers() {
    return await this.userService.users();
  }

  @Query(() => UserDto)
  async me(@GetToken() token: string) {
    const payload = await this.authService.verify(token);
    return await this.userService.me(payload);
  }

  @Query(() => String)
  async helloNestJS() {
    return 'Hello, NestJS!!!';
  }

  @Query(() => TokenDto)
  async getRefreshToken(@GetToken() token: string): Promise<TokenDto> {
    const payload = await this.authService.verify(token);
    if (typeof payload === 'undefined') return { refreshToken: '' };

    const { id, email } = await this.userService.me(payload);
    return {
      refreshToken: await this.authService.createAccessToken(id, email),
    };
  }

  @Mutation(() => Boolean)
  async register(
    @Args('registerInput') { nickname, email, password }: RegisterInput,
  ) {
    return await this.userService.saveRegister({ nickname, email, password });
  }

  @Mutation(() => Boolean)
  async deleteAccount(
    @GetToken() token: string,
    @Args('deleteAccountInput')
    { nickname, email, password }: DeleteAccountInput,
    @Context() ctx: MyContext,
  ) {
    // Cookieからユーザー情報を取得
    const payload = await this.authService.verify(token);
    const data = await this.userService.me(payload);
    // ユーザーを削除
    await this.userService.executeDelete(nickname, email, password, data);
    // TodoListを削除
    await this.todoService.todoAllDelete(payload);
    // Cookieを削除
    await this.authService.clearCookiesToken(ctx.res, token);
    return true;
  }

  @Mutation(() => Boolean)
  async logOut(@Context() ctx: MyContext, @GetToken() token: string) {
    const payload = await this.authService.verify(token);
    await this.authService.clearCookiesToken(ctx.res, token);
    return await this.userService.loginStutasFalse(payload);
  }

  @Mutation(() => UserDto)
  async login(@Args('loginInput') loginInput: LoginInput): Promise<UserDto> {
    const { id, nickname, email } = await this.userService.validateUser(
      loginInput,
    );
    const accessToken = await this.authService.createAccessToken(id, email);
    return {
      id,
      nickname,
      email,
      accessToken,
    };
  }

  // テストユーザーログイン専用クエリ
  @Mutation(() => UserDto)
  async testUserLogin(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<UserDto> {
    const { id, nickname, email } = await this.userService.validateTestUser(
      loginInput.email,
      loginInput.password,
    );
    // アクセストークン生成
    const accessToken = await this.authService.createAccessToken(id, email);
    return {
      id,
      nickname,
      email,
      accessToken,
    };
  }
}
