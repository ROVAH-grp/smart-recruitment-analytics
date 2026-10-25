import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCandidateDto {
  @ApiProperty({ example: 'C0001', description: 'Unique candidate identifier' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  candidateId: string;

  @ApiProperty({ example: 'Rahul Sharma' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  candidateName: string;

  @ApiPropertyOptional({ example: 4.5, minimum: 0, maximum: 99.9 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99.9)
  experienceYears?: number;

  @ApiPropertyOptional({ example: 'B.Tech Computer Science' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  education?: string;
}
