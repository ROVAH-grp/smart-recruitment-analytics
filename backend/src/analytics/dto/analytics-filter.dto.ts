import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class AnalyticsFilterDto {
  @ApiPropertyOptional({ description: 'Filter by job department', example: 'AI & ML' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ description: 'Filter by recruitment source name', example: 'LinkedIn' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({ description: 'Filter by recruiter name', example: 'Anita Verma' })
  @IsOptional()
  @IsString()
  recruiter?: string;

  @ApiPropertyOptional({ description: 'Filter by job id', example: 'J001' })
  @IsOptional()
  @IsString()
  jobId?: string;

  @ApiPropertyOptional({ description: 'Filter by candidate education', example: 'MBA' })
  @IsOptional()
  @IsString()
  education?: string;

  @ApiPropertyOptional({ description: 'Filter by application status', example: 'Joined' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Start date (inclusive), applies to application_date', example: '2026-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date (inclusive), applies to application_date', example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
