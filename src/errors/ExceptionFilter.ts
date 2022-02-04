import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/ILogger';
import { TYPES } from '../types';
import { HttpError } from './HttpError';
import { IExceptionFilter } from './IExceptionFilter';
import 'reflect-metadata';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(
		@inject(TYPES.ILogger)
		private logger: ILogger,
	) {}

	catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HttpError) {
			this.logger.error(`[${err.context}] Error ${err.statusCode}: ${err.message}`);
			res.status(err.statusCode).send({ err: err.message });
		} else {
			this.logger.error(`Error: ${err.message}`);
			res.status(500).send({ err: err.message });
		}
	}
}
