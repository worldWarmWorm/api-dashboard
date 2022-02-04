import { UserLoginDto } from './dto/UserLoginDto';
import { UserRegisterDto } from './dto/UserRegisterDto';
import { User } from './User';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<User | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
}
