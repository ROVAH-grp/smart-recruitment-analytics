import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRecruiterDto {
  @ApiProperty({ example: 'Anita Verma' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  recruiterName: string;
}
