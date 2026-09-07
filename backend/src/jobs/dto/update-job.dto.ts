import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateJobDto {
  @ApiPropertyOptional({ example: 'Data Analyst Intern' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  jobTitle?: string;

  @ApiPropertyOptional({ example: 'Analytics' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string;

  @ApiPropertyOptional({ example: '2026-09-07' })
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

  @ApiPropertyOptional({ example: 0 })
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