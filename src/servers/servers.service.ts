import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from 'src/servers/entities/server.entity';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';


@Injectable()
export class ServersService {
  constructor(
    @InjectRepository(Server)
    private readonly serversRepository: Repository<Server>,
  ) {}

  create(createServerDto: CreateServerDto) {
    return this.serversRepository.save(createServerDto);   
  }

  findAll() {
    return this.serversRepository.find();
  }

  findOne(id: number) {
    return this.serversRepository.findOne(id);
  }

  update(id: number, updateServerDto: UpdateServerDto) {
    return this.serversRepository.save({
      id: id,
      ...updateServerDto,
    }); 
   }

  async remove(id: number) {
    await this.serversRepository.softDelete(id);
  }
}
