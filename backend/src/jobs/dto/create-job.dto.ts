import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateJobDto {
  @ApiProperty({ example: 'J001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  jobId!: string;

  @ApiProperty({ example: 'Data Analyst Intern' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  jobTitle!: string;

  @ApiPropertyOptional({ example: 'AI & ML' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string;

  @ApiPropertyOptional({ example: '2026-01-15' })
  @IsOptional()
  @IsDateString()
  jobPostedDate?: string;

  @ApiPropertyOptional({
    example: ['Python', 'SQL', 'Power BI'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredSkills?: string[];

  @ApiPropertyOptional({
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  requiredExperienceYears?: number;

  @ApiPropertyOptional({
    example: ['Bachelor'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredEducation?: string[];

  @ApiPropertyOptional({
    example: [],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredCertifications?: string[];

  @ApiPropertyOptional({
    example: ['dashboard', 'analytics'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredProjectsKeywords?: string[];
}