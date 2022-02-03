import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { BaseController } from "../common/BaseController";
import { HttpError } from "../errors/HttpError";
import { ILogger } from "../logger/ILogger";
import { TYPES } from "../types";
import "reflect-metadata";

@injectable()
export class UsersController extends BaseController {
  constructor(@inject(TYPES.ILogger) private LoggerService: ILogger) {
    super(LoggerService);
    this.bindRoutes([
      {
        path: "/register",
        method: "post",
        func: this.register
      },
      {
        path: "/login",
        method: "post",
        func: this.login
      }
    ]);
  }

  login(req: Request, res: Response, next: NextFunction) {
    // this.ok(res, "login");
    next(new HttpError(401, "Not logined", "login"));
  }

  register(req: Request, res: Response, next: NextFunction) {
    this.ok(res, "register");
  }
}