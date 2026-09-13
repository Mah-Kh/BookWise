import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';
import { BooksService } from './books.service.js';
import { BookIdParamsDto } from './dto/book-id-params.dto.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}
  @Get()
  getBooks() {
    return this.booksService.getBooks();
  }

  @Get(':id')
  getBook(@Param() params: BookIdParamsDto) {
    return this.booksService.getBook(params.id);
  }

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
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
