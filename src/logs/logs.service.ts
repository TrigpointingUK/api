import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './entities/log.entity';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { Trig } from '../trigs/entities/trig.entity';
import { TrigsService } from '../trigs/trigs.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CoordsService } from 'src/coords/coords.service';
import { Point } from 'geojson';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private readonly logsRepository: Repository<Log>,
    private readonly trigsService: TrigsService,
    private readonly usersService: UsersService,
    private readonly coordsService: CoordsService,
  ) {}

  async create(createLogDto: CreateLogDto): Promise<Log> {
    const log = new Log()
    Object.keys(createLogDto).forEach((key) => {
      log[key] = createLogDto[key] ? createLogDto[key] : null;
    });



    const trig: Trig = await this.trigsService.findById(createLogDto.trig_id);
    if (!trig) {
      throw new NotFoundException(`Trig ${createLogDto.trig_id} not found.`);
    }
    log.trig = trig

    const user: User = await this.usersService.findById(createLogDto.user_id);
    if (!trig) {
      throw new NotFoundException(`Trig ${createLogDto.trig_id} not found.`);
    }
    log.user = user

    // Fill empty osgb values
    if (
      (log.osgb_eastings == null || log.osgb_northings == null) &&
      log.wgs_lat != null &&
      log.wgs_lon != null
    ) {
      let osgb = this.coordsService.WGStoOSGB({
        lat: log.wgs_lat,
        lng: log.wgs_lon,
      });
      [log.osgb_eastings, log.osgb_northings] = [osgb['ea'], osgb['no']];
    }

    // Fill missing wgs values
    if (
      (log.wgs_lat == null || log.wgs_lon == null) &&
      log.osgb_eastings != null &&
      log.osgb_northings != null
    ) {
      let wgs = this.coordsService.OSGBtoWGS({
        ea: log.osgb_eastings,
        no: log.osgb_northings,
      });
      [log.wgs_lat, log.wgs_lon] = [wgs['lat'], wgs['lng']];
    }

    // Create Geography for WGS
    if (log.wgs_lat != null && log.wgs_lon != null) {
      const wgs_point: Point = {
        type: 'Point',
        coordinates: [log.wgs_lon, log.wgs_lat],
      };
      log.wgs_point = wgs_point;
    }

    if (log.osgb_eastings != null && log.osgb_northings != null) {
      // Create Geometry for OSGB
      const osgb_point: Point = {
        type: 'Point',
        coordinates: [log.osgb_eastings, log.osgb_northings],
      };
      log.osgb_point = osgb_point;
      // Generate Grid Reference
      log.osgb_gridref = this.coordsService.toGridRef({
        ea: log.osgb_eastings,
        no: log.osgb_northings,
      });
    }


    log.deletedAt = null;



    return this.logsRepository.save(log);
  }

  findAll() {
    return this.logsRepository.find({ relations: ['trig'] });
  }

  findById(id: number) {
    return this.logsRepository.findOne(id);
  }

  update(id: number, updateLogDto: UpdateLogDto) {
    return this.logsRepository.save({
      id: id,
      ...updateLogDto,
    });
  }

  async remove(id: number) {
    await this.logsRepository.softDelete(id);
  }
}
