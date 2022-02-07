import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './App';
import { ExceptionFilter } from './errors/ExceptionFilter';
import { IExceptionFilter } from './errors/IExceptionFilter';
import { ILogger } from './logger/ILogger';
import { LoggerService } from './logger/LoggerService';
import { TYPES } from './types';
import { IUsersController } from './entity/users/controller/IUsersController';
import { UsersController } from './entity/users/controller/UsersController';
import { IUserService } from './entity/users/IUserService';
import { UserService } from './entity/users/UserService';
import { IConfigService } from './config/IConfigService';
import { ConfigService } from './config/ConfigService';
import { PrismaService } from './db/PrismaService';
import { UserRepository } from './entity/users/repository/UserRepository';
import { IUserRepository } from './entity/users/repository/IUserRepository';

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
	bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
	bind<App>(TYPES.Application).to(App);
});

async function bootstrap(): Promise<IBootstrap> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return { appContainer, app };
}

export const boot = bootstrap();
