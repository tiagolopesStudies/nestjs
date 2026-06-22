import { IsBoolean, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  public readonly text: string;

  @IsPositive()
  public readonly fromId: number;

  @IsPositive()
  public readonly toId: number;

  @IsBoolean()
  @IsOptional()
  public readonly read?: boolean;
}
