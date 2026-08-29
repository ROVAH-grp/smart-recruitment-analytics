import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class QueryApplicationDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'Joined' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'C0001' })
  @IsOptional()
  @IsString()
  candidateId?: string;

  @ApiPropertyOptional({ example: 'J001' })
  @IsOptional()
  @IsString()
  jobId?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  recruiterId?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sourceId?: number;

  @ApiPropertyOptional({ description: 'Filter by job department', example: 'AI & ML' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: ['applicationDate', 'matchScore', 'createdAt'] })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
