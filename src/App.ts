import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { IExceptionFilter } from './errors/IExceptionFilter';
import { ILogger } from './logger/ILogger';
import { TYPES } from './types';
import { UsersController } from './controller/user/UsersController';
import { json } from 'body-parser';
import 'reflect-metadata';
import { IConfigService } from './config/IConfigService';
import { PrismaService } from './db/PrismaService';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger)
		private logger: ILogger,

		@inject(TYPES.UsersController)
		private usersController: UsersController,

		@inject(TYPES.ExceptionFilter)
		private exceptionFilter: IExceptionFilter,

		@inject(TYPES.ConfigService)
		private configService: IConfigService,

		@inject(TYPES.PrismaService)
		private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(json());
	}

	useRoutes(): void {
		this.app.use('/users', this.usersController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server started at http://localhost:${this.port}`);
	}
}
