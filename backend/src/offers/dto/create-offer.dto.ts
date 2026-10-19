import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum OfferStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  DECLINED = 'Declined',
  WITHDRAWN = 'Withdrawn',
}

export class CreateOfferDto {
  @ApiProperty({ example: '1', description: 'Application id this offer belongs to' })
  @IsString()
  @IsNotEmpty()
  applicationId: string;

  @ApiPropertyOptional({ example: '2026-01-28' })
  @IsOptional()
  @IsDateString()
  offerDate?: string;

  @ApiPropertyOptional({ enum: OfferStatus, example: OfferStatus.PENDING })
  @IsOptional()
  @IsIn(Object.values(OfferStatus))
  offerStatus?: string;
}
