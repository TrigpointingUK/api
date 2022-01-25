import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LogsService } from './logs.service';
// import { Log } from './entities/log';

import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('logs')
@ApiTags('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  /**
   * Create a new log
   */
  @Post()
  create(@Body() createLogDto: CreateLogDto) {
    return this.logsService.create(createLogDto);
  }

  /**
   * List all logs
   */
  @Get()
  findAll() {
    return this.logsService.findAll();
  }

  /**
   * List recent logs
   */
  @Get('recent')
  findRecent() {
    return this.logsService.findAll();
  }

  /**
   * Retrieve a single log
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogDto: UpdateLogDto) {
    return this.logsService.update(+id, updateLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logsService.remove(+id);
  }
}
