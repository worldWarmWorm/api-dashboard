import { Request, Response, NextFunction } from "express";
import { BaseController } from "../common/BaseController";
import { HttpError } from "../errors/HttpError";
import { LoggerService } from "../logger/LoggerService";

export class UsersController extends BaseController {
  constructor(logger: LoggerService) {
    super(logger);
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