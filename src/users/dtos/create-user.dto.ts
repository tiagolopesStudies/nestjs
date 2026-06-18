import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(5)
  public readonly name: string;

  @IsEmail()
  public readonly email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  public readonly password: string;
}
