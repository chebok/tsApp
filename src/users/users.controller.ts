import { NextFunction, Request, Response } from 'express';
import { IUserController } from './users.controller.interface';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user.register.dto';
import { User } from './user.entity';
import { UserService } from './users.service';
import { ValidateMiddleware } from '../common/validate.middleware';

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.UserService) private userService: UserService,
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        path: '/login',
        func: this.login,
        method: 'post',
        middlewares: [new ValidateMiddleware(UserLoginDto)],
      },
      {
        path: '/register',
        func: this.register,
        method: 'post',
        middlewares: [new ValidateMiddleware(UserRegisterDto)],
      },
    ]);
  }

  async login(
    { body }: Request<{}, {}, UserLoginDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.userService.validateUser(body);
    if (!result) {
      return next(new HTTPError(401, 'Ошибка авторизации', 'login'));
    }
    this.ok(res, 'Авторизация успешна');
  }

  async register(
    { body }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.userService.createUser(body);
    if (!result) {
      return next(new HTTPError(422, 'такой юзер уже существует'));
    }
    this.ok(res, { email: result.email, id: result.id });
  }
}
