import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './entities/log.entity';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { Trig } from '../trigs/entities/trig.entity';
import { TrigsService } from '../trigs/trigs.service';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private readonly logsRepository: Repository<Log>,
    private readonly trigsService: TrigsService,
  ) {}

  async create(createLogDto: CreateLogDto): Promise<Log> {
    const trig: Trig = await this.trigsService.findOne(createLogDto.trig_id);
    if (!trig) {
      throw new NotFoundException(`Trig ${createLogDto.trig_id} not found.`);
    }
    return this.logsRepository.save({ ...createLogDto, trig });
  }

  findAll() {
    return this.logsRepository.find({ relations: ['trig'] });
  }

  findOne(id: number) {
    return this.logsRepository.findOne(id);
  }

  update(id: number, updateLogDto: UpdateLogDto) {
    return this.logsRepository.save({
      id: id,
      ...updateLogDto,
    });
  }

  async remove(id: number) {
    await this.logsRepository.delete(id);
  }
}
