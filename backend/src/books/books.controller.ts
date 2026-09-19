import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { BooksService } from './books.service.js';
import { BookIdParamsDto } from './dto/book-id-params.dto.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';
import { BookIngestionService } from './book-ingestion.service.js';

@Controller('books')
export class BooksController {
  constructor(
    private booksService: BooksService,
    private readonly bookIngestionService: BookIngestionService,
  ) {}
  @Get()
  getBooks() {
    return this.booksService.getBooks();
  }

  @Get('search')
  searchBooks(@Query('q') query: string) {
    return this.booksService.searchExternalBooks(query);
  }

  @Get(':id')
  getBook(@Param() params: BookIdParamsDto) {
    return this.booksService.getBook(params.id);
  }

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Post(':id/ingest')
  ingestBook(@Param() params: BookIdParamsDto) {
    return this.booksService.ingestBook(params.id);
  }

  @Post(':id/embed')
  embedExistingChunks(@Param('id', ParseIntPipe) id: number) {
    return this.bookIngestionService.embedExistingChunks(id);
  }

  @Patch(':id')
  updateBook(
    @Param() params: BookIdParamsDto,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.updateBook(params.id, updateBookDto);
  }

  @Delete(':id')
  deleteBook(@Param() params: BookIdParamsDto) {
    return this.booksService.deleteBook(params.id);
  }
}
