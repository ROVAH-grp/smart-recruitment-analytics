import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum JoiningStatus {
  JOINED = 'Joined',
  NO_SHOW = 'No Show',
  DELAYED = 'Delayed',
  CANCELLED = 'Cancelled',
}

export class CreateJoiningRecordDto {
  @ApiProperty({ example: '1', description: 'Application id this joining record belongs to' })
  @IsString()
  @IsNotEmpty()
  applicationId: string;

  @ApiPropertyOptional({ example: '2026-02-15' })
  @IsOptional()
  @IsDateString()
  joiningDate?: string;

  @ApiPropertyOptional({ enum: JoiningStatus, example: JoiningStatus.JOINED })
  @IsOptional()
  @IsIn(Object.values(JoiningStatus))
  joiningStatus?: string;
}
