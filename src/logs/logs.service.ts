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
import { ConfigModule } from '@nestjs/config';

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
      log[key] = (createLogDto[key] === "") ? null : createLogDto[key];
    });



    const trig: Trig = await this.trigsService.findById(createLogDto.trig_id);
    if (!trig) {
      throw new NotFoundException(`Trig ${createLogDto.trig_id} not found.`);
    }
    log.trig = trig
    delete log['trig_id']

    const user: User = await this.usersService.findById(createLogDto.user_id);
    if (!user) {
      throw new NotFoundException(`User ${createLogDto.user_id} not found.`);
    }
    log.user = user
    delete log['user_id']

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

    // Date handling
    if (createLogDto.visit_timestamp == null) {
      try {
        const dateParts = createLogDto.visit_date.split("-");
        const timeParts = createLogDto.visit_time.split(":");
        log.visit_timestamp = new Date(parseInt(dateParts[0]), parseInt(dateParts[1])-1, parseInt(dateParts[2]), parseInt(timeParts[0]), parseInt(timeParts[1]), parseInt(timeParts[2]));
      } catch(exception) {
        log.visit_timestamp = new Date()
      }
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
