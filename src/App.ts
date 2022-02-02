import express, { Express } from "express";
import { Server } from "http";
import { ExceprionFilter } from "./errors/ExceprionFilter";
import { ILogger } from "./logger/ILogger";
import { UsersController } from "./users/UsersController";

export class App {
  app: Express;
  server: Server;
  port: number;
  logger: ILogger;
  usersController: UsersController;
  exceprionFilter: ExceprionFilter;

  constructor(
    logger: ILogger,
    usersController: UsersController,
    exceprionFilter: ExceprionFilter
  ) {
    this.app = express();
    this.port = 8000;
    this.logger = logger;
    this.usersController = usersController;
    this.exceprionFilter = exceprionFilter;
  }

  useRoutes() {
    this.app.use("/users", this.usersController.router);
  }

  useExceptionFilters() {
    this.app.use(this.exceprionFilter.catch.bind(this.exceprionFilter));
  }

  public async init() {
    this.useRoutes();
    this.useExceptionFilters();
    this.server = this.app.listen(this.port);
    this.logger.log(`Server started at http://localhost:${this.port}`);
  }
}