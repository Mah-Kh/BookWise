import { IsNotEmpty, IsString } from 'class-validator';

export class AddUserBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  externalId: string;
}
