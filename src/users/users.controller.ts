import { Request, Response } from "express";
import { BaseController } from "../common/base.controller";
import { LoggerService } from "../logger/logger.service";


export class UserController extends BaseController {
  constructor( logger: LoggerService) {
    super(logger);
    this.bindRoutes([
      {path: '/login', func: (req, res) => this.login(req, res), method: 'post' },
      {path: '/register', func: (req, res) => this.register(req, res), method: 'post' }
    ])
  }

  login(req: Request, res: Response, ) {
    this.ok(res, 'login');
  }

  register(req: Request, res: Response) {
    this.created(res);
  }
}