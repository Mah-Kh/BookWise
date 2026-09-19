import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../auth/guards/jwt-auth.guard.js';
import { LibraryService } from './library.service.js';
import { UpdateFavoriteDto } from './dto/update-favorite.dto.js';
import { UpdateReadingStatusDto } from './dto/update-reading-status.dto.js';

@Controller('library')
@UseGuards(JwtAuthGuard)
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get()
  getLibrary(@Req() request: AuthenticatedRequest) {
    return this.libraryService.getLibrary(request.user.sub);
  }

  @Post()
  addBook(
    @Req() request: AuthenticatedRequest,
    @Body('bookId') bookId: number,
  ) {
    return this.libraryService.addBook(request.user.sub, bookId);
  }

  @Delete(':bookId')
  removeBook(
    @Req() request: AuthenticatedRequest,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.libraryService.removeBook(request.user.sub, bookId);
  }

  @Patch(':bookId/status')
  updateStatus(
    @Req() request: AuthenticatedRequest,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() dto: UpdateReadingStatusDto,
  ) {
    return this.libraryService.updateStatus(
      request.user.sub,
      bookId,
      dto.status,
    );
  }

  @Patch(':bookId/favorite')
  updateFavorite(
    @Req() request: AuthenticatedRequest,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() dto: UpdateFavoriteDto,
  ) {
    return this.libraryService.updateFavorite(
      request.user.sub,
      bookId,
      dto.isFavorite,
    );
  }
}
