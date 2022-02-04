import { inject, injectable } from 'inversify';
import { PrismaClient, UserModel } from '@prisma/client';
import { TYPES } from '../types';
import { ILogger } from '../logger/ILogger';

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('[PrismaService] Database connected');
		} catch (error) {
			if (error instanceof Error) {
				this.logger.log(`[PrismaService] Database connection error: ${error.message}`);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
