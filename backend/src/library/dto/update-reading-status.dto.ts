import { IsEnum } from 'class-validator';
import { ReadingStatus } from '../../generated/prisma/enums.js';

export class UpdateReadingStatusDto {
  @IsEnum(ReadingStatus)
  status: ReadingStatus;
}
