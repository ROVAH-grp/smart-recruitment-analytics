import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class QueryJobDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Search by job title or job id', example: 'Engineer' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by department', example: 'AI & ML' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ enum: ['jobTitle', 'department', 'jobPostedDate', 'createdAt'] })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
