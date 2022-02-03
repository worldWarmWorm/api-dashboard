import { Container } from "inversify";
import { App } from "./App";
import { ExceprionFilter } from "./errors/ExceprionFilter";
import { IExceptionFilter } from "./errors/IExceptionFilter";
import { ILogger } from "./logger/ILogger";
import { LoggerService } from "./logger/LoggerService";
import { TYPES } from "./types";
import { UsersController } from "./users/UsersController";



const appContainer = new Container();
appContainer.bind<ILogger>(TYPES.ILogger).to(LoggerService);
appContainer.bind<IExceptionFilter>(TYPES.ExceprionFilter).to(ExceprionFilter);
appContainer.bind<UsersController>(TYPES.UsersController).to(UsersController);
appContainer.bind<App>(TYPES.Application).to(App);

const app = appContainer.get<App>(TYPES.Application);
app.init();

export { app, appContainer };