import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { Request } from 'express';

import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

import { Permissions } from 'src/permissions.decorator';
import { PermissionsGuard } from 'src/permissions.guard';

import { ApiBearerAuth, ApiOAuth2, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@ApiTags('users') // swagger
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user
   */
  @Post()
  @UseGuards(AuthGuard('tukjwt'), PermissionsGuard)
  @Permissions('create:users')
  @ApiBearerAuth('jwt') // swagger
  @ApiOAuth2([]) // swagger
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Get details of currently logged in user
   * @param request
   * @returns
   */
  @Get('me')
  @UseGuards(AuthGuard('tukjwt'))
  @ApiOAuth2([]) // swagger
  getMyUser(@Req() request: Request) {
    return this.usersService.getMyUser(
      request['user']['sub'],
      request['user']['https://trigpointing.uk/email'],
      request.cookies['cryptpw'],
      request.cookies['authid'],
      request.headers['authorization'],
    );
  }

  @Patch('me')
  @UseGuards(AuthGuard('tukjwt'))
  @ApiOAuth2([]) // swagger
  updateMyUser(@Req() request: Request, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateMyUser(
      request['user']['sub'],
      updateUserDto,
    );
  }

  /**
   * Find a user
   */
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(+id);
  }

  /**
   * List all users
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Soft delete a user
   */
  @Delete(':id')
  @ApiBearerAuth('jwt') // swagger
  @ApiOAuth2([]) // swagger
  @UseGuards(AuthGuard('tukjwt'), PermissionsGuard)
  @Permissions('create:users')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(+id);
  }
}
