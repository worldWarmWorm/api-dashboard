import { IUserRepository } from './IUserRepository';
import { UserModel } from '@prisma/client';
import { User } from '../User';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { PrismaService } from '../../../db/PrismaService';

@injectable()
export class UserRepository implements IUserRepository {
	constructor(@inject(TYPES.PrismaService) private prismaServece: PrismaService) {}

	async create({ email, password, name }: User): Promise<UserModel> {
		return this.prismaServece.client.userModel.create({
			data: {
				email,
				password,
				name,
			},
		});
	}

	async find(email: string): Promise<UserModel | null> {
		return this.prismaServece.client.userModel.findFirst({
			where: { email },
		});
	}
}
