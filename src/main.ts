import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './App';
import { ExceptionFilter } from './errors/ExceptionFilter';
import { IExceptionFilter } from './errors/IExceptionFilter';
import { ILogger } from './logger/ILogger';
import { LoggerService } from './logger/LoggerService';
import { TYPES } from './types';
import { IUsersController } from './controller/user/IUsersController';
import { UsersController } from './controller/user/UsersController';
import { IUserService } from './entity/users/IUserService';
import { UserService } from './entity/users/UserService';
import { IConfigService } from './config/IConfigService';
import { ConfigService } from './config/ConfigService';
import { PrismaService } from './db/PrismaService';

export interface IBootstrap {
	appContainer: Container;
	app: App;
}

// DI tree
export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<IUsersController>(TYPES.UsersController).to(UsersController);
	bind<IUserService>(TYPES.UserService).to(UserService);
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<App>(TYPES.Application).to(App);
});

function bootstrap(): IBootstrap {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { appContainer, app };
}

export const { app, appContainer } = bootstrap();
