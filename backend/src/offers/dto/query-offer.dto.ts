import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class QueryOfferDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsString()
  applicationId?: string;

  @ApiPropertyOptional({ example: 'Accepted' })
  @IsOptional()
  @IsString()
  offerStatus?: string;
}
