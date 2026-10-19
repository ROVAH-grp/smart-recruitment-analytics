import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApplicationStatus } from '../entities/application.entity';

export class CreateApplicationDto {
  @ApiProperty({ example: 'C0001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  candidateId: string;

  @ApiProperty({ example: 'J001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  jobId: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  recruiterId?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  sourceId?: number;

  @ApiPropertyOptional({ example: '2026-01-10' })
  @IsOptional()
  @IsDateString()
  applicationDate?: string;

  @ApiPropertyOptional({ example: '2026-01-12' })
  @IsOptional()
  @IsDateString()
  screeningDate?: string;

  @ApiPropertyOptional({ example: '2026-01-15' })
  @IsOptional()
  @IsDateString()
  shortlistDate?: string;

  @ApiPropertyOptional({ example: '2026-01-20' })
  @IsOptional()
  @IsDateString()
  interviewDate?: string;

  @ApiPropertyOptional({ example: '2026-01-25' })
  @IsOptional()
  @IsDateString()
  selectionDate?: string;

  @ApiPropertyOptional({ example: '2026-01-28' })
  @IsOptional()
  @IsDateString()
  offerDate?: string;

  @ApiPropertyOptional({ example: '2026-02-15' })
  @IsOptional()
  @IsDateString()
  joiningDate?: string;

  @ApiPropertyOptional({ enum: ApplicationStatus, example: ApplicationStatus.APPLIED })
  @IsOptional()
  @IsIn(Object.values(ApplicationStatus))
  status?: string;

  @ApiPropertyOptional({ example: 82.5, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  matchScore?: number;

  @ApiPropertyOptional({ example: 15000.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  recruitmentCost?: number;
}
