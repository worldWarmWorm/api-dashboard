import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Email is uncorrect' })
	@IsNotEmpty({ message: 'Email is required' })
	email: string;

	@IsString({ message: 'Missing password' })
	@IsNotEmpty({ message: 'Password is required' })
	password: string;
}
