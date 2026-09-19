import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OpenLibraryService {
  constructor(private readonly httpService: HttpService) {}

  async search(query: string) {
    const response = await firstValueFrom(
      this.httpService.get('https://openlibrary.org/search.json', {
        params: {
          q: query,
          limit: 10,
        },
      }),
    );

    return response.data;
  }
}
