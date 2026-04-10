import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public readonly name!: string;
  @IsEmail()
  public readonly email!: string;
  @IsString()
  @MinLength(6)
  public readonly password!: string;
}
