import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './App';
import { ExceprionFilter } from './errors/ExceprionFilter';
import { IExceptionFilter } from './errors/IExceptionFilter';
import { ILogger } from './logger/ILogger';
import { LoggerService } from './logger/LoggerService';
import { TYPES } from './types';
import { IUsersController } from './controller/user/IUsersController';
import { UsersController } from './controller/user/UsersController';

export interface IBootstrap {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService);
	bind<IExceptionFilter>(TYPES.ExceprionFilter).to(ExceprionFilter);
	bind<IUsersController>(TYPES.UsersController).to(UsersController);
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
