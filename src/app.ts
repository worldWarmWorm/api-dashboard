import express, { Express } from "express";
import { Server } from "http";

export class App {
  app: Express;
  server: Server;
  port: number;

  constructor() {
    this.app = express();
    this.port = 8000;
  }

  useRoutes() {
    // this.app.use()
  }

  public async init() {
    this.useRoutes();
    this.server = this.app.listen(this.port)
    console.info(`Server started at http://localhost:${this.port}`);
  }
}