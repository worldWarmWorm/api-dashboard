import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Email is uncorrect' })
	@IsNotEmpty({ message: 'Email is required' })
	email: string;

	@IsString({ message: 'Missing password' })
	@IsNotEmpty({ message: 'Password is required' })
	password: string;

	@IsString({ message: 'Missing name' })
	@IsNotEmpty({ message: 'Name is required' })
	name: string;
}
