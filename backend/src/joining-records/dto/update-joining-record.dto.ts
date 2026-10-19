import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateJoiningRecordDto } from './create-joining-record.dto';

export class UpdateJoiningRecordDto extends PartialType(
  OmitType(CreateJoiningRecordDto, ['applicationId'] as const),
) {}
