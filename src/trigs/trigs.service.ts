import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Point } from 'geojson';

import { Trig } from './entities/trig.entity';
import { CreateTrigDto } from './dto/create-trig.dto';
import { UpdateTrigDto } from './dto/update-trig.dto';
import { CoordsService } from 'src/coords/coords.service';

@Injectable()
export class TrigsService {
  constructor(
    @InjectRepository(Trig)
    private readonly trigsRepository: Repository<Trig>,
    private readonly coordsService: CoordsService,
  ) {}

  create(createTrigDto: CreateTrigDto): Promise<Trig> {
    const trig = new Trig();
    Object.keys(createTrigDto).forEach((key) => {
      trig[key] = createTrigDto[key];
    });

    // Fill empty osgb values
    if (
      (trig.osgb_eastings == null || trig.osgb_northings == null) &&
      trig.wgs_lat != null &&
      trig.wgs_lon != null
    ) {
      let osgb = this.coordsService.WGStoOSGB({
        lat: trig.wgs_lat,
        lng: trig.wgs_lon,
      });
      [trig.osgb_eastings, trig.osgb_northings] = [osgb['ea'], osgb['no']];
    }

    // Fill missing wgs values
    if (
      (trig.wgs_lat == null || trig.wgs_lon == null) &&
      trig.osgb_eastings != null &&
      trig.osgb_northings != null
    ) {
      let wgs = this.coordsService.OSGBtoWGS({
        ea: trig.osgb_eastings,
        no: trig.osgb_northings,
      });
      [trig.wgs_lat, trig.wgs_lon] = [wgs['lat'], wgs['lng']];
    }

    // Create Geography for WGS
    if (trig.wgs_lat != null && trig.wgs_lon != null) {
      const wgs_point: Point = {
        type: 'Point',
        coordinates: [trig.wgs_lon, trig.wgs_lat],
      };
      trig.wgs_point = wgs_point;
    }

    // Create Geometry for OSGB
    if (trig.osgb_eastings != null && trig.osgb_northings != null) {
      const osgb_point: Point = {
        type: 'Point',
        coordinates: [trig.osgb_eastings, trig.osgb_northings],
      };
      trig.osgb_point = osgb_point;
    }

    // Soft undelete
    trig.deletedAt = null;

    // console.log(trig);
    return this.trigsRepository.save(trig);
  }

  findAll() {
    return this.trigsRepository.find();
  }

  async findById(id: number) {
    if (id % 2 == 0) await new Promise((r) => setTimeout(r, 2000)); // TODO: Only for testing!

    return this.trigsRepository.findOne(id);
  }

  update(id: number, updateTrigDto: UpdateTrigDto) {
    return this.trigsRepository.save({
      id: id,
      ...updateTrigDto,
    });
  }

  async remove(id: number) {
    await this.trigsRepository.softDelete(id);
  }
}
