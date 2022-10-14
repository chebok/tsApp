import { NextFunction, Request, Response } from "express";
import { BaseController } from "../common/base.controller";
import { HTTPError } from "../errors/http-error.class";
import { LoggerService } from "../logger/logger.service";


export class UserController extends BaseController {
  constructor( logger: LoggerService) {
    super(logger);
    this.bindRoutes([
      {path: '/login', func: this.login, method: 'post' },
      {path: '/register', func: this.register, method: 'post' }
    ])
  }

  login(req: Request, res: Response, next: NextFunction) {
    next(new HTTPError(401, 'Ошибка авторизации', 'login'));
  }

  register(req: Request, res: Response, next: NextFunction) {
    this.created(res);
  }
}