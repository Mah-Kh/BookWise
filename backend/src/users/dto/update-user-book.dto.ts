import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class UpdateUserBookDto {
  @IsOptional()
  @IsEnum(['WANT_TO_READ', 'READING', 'COMPLETED'])
  status?: 'WANT_TO_READ' | 'READING' | 'COMPLETED';

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;
}
