import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSourceDto {
  @ApiProperty({ example: 'LinkedIn' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sourceName: string;
}
