import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { AuthenticatedRequest } from '../auth/guards/jwt-auth.guard.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

import { UsersService } from './users.service.js';
import { AddUserBookDto } from './dto/add-user-book.dto.js';
import { UpdateUserBookDto } from './dto/update-user-book.dto.js';

@Controller('user-books')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getLibrary(@Req() req: AuthenticatedRequest) {
    return this.usersService.getLibrary(req.user.sub);
  }

  @Post()
  addBook(@Req() req: AuthenticatedRequest, @Body() dto: AddUserBookDto) {
    return this.usersService.addBook(req.user.sub, dto.title, dto.externalId);
  }

  @Patch(':bookId')
  updateBook(
    @Req() req: AuthenticatedRequest,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() dto: UpdateUserBookDto,
  ) {
    return this.usersService.updateBook(req.user.sub, bookId, dto);
  }

  @Delete(':bookId')
  removeBook(
    @Req() req: AuthenticatedRequest,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.usersService.removeBook(req.user.sub, bookId);
  }
}
