import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { Container } from 'inversify';
import { IConfigService } from '../../../config/IConfigService';
import { TYPES } from '../../../types';
import { IUserService } from '../IUserService';
import { IUserRepository } from '../repository/IUserRepository';
import { User } from '../User';
import { UserService } from '../UserService';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UserReposirotyMock: IUserRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let userRepository: IUserRepository;
let userService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUserRepository>(TYPES.UserRepository).toConstantValue(UserReposirotyMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	userRepository = container.get<IUserRepository>(TYPES.UserRepository);
	userService = container.get<IUserService>(TYPES.UserService);
});

let createdUser: UserModel | null;

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		userRepository.create = jest.fn().mockImplementationOnce(
			({ name, email, password }: User): UserModel => ({
				name,
				email,
				password,
				id: 1,
			}),
		);
		createdUser = await userService.createUser({
			email: 'a@a.ru',
			name: 'User',
			password: '1',
		});
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('1');
	});

	it('validateUser - success', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await userService.validateUser({
			email: 'a@a.ru',
			password: '1',
		});
		expect(res).toBeTruthy();
	});

	it('validateUser - wrong password', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await userService.validateUser({
			email: 'a@a.ru',
			password: '2',
		});
		expect(res).toBeFalsy();
	});

	it('validateUser - empty user', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(null);
		const res = await userService.validateUser({
			email: 'a@a.ru',
			password: '2',
		});
		expect(res).toBeFalsy();
	});
});
