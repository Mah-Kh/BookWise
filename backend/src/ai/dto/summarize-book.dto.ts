import { IsInt, Min } from 'class-validator';

export class SummarizeBookDto {
  @IsInt()
  @Min(1)
  bookId: number;
}
