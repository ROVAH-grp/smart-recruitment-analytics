import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class QueryRecruiterDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Search by recruiter name', example: 'Anita' })
  @IsOptional()
  @IsString()
  search?: string;
}
