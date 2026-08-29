import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class QuerySourceDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Search by source name', example: 'LinkedIn' })
  @IsOptional()
  @IsString()
  search?: string;
}
