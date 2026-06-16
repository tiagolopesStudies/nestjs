import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  public readonly text: string;
  @IsString()
  public readonly from: string;
  @IsString()
  public readonly to: string;
  @IsBoolean()
  @IsOptional()
  public readonly read?: boolean;
}
