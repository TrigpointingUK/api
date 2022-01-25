import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CoordsService } from 'src/coords/coords.service';
import { Repository } from 'typeorm';
import { CreateTrigDto } from './dto/create-trig.dto';

import {
  TrigCondition,
  CurrentUse,
  HistoricUse,
  PhysicalType,
  Status,
} from 'src/enum_types';
import { TrigsService } from './trigs.service';
import { Trig } from './entities/trig.entity';

const trig01 = {
  id: 1,
  name: 'trig',
  wgs_lat: 51,
  wgs_lon: -1,
  osgb_eastings: 470267.34536504897,
  osgb_northings: 122765.53816158895,
  wgs_point: { type: 'Point', coordinates: [-1, 51] },
  osgb_point: {
    type: 'Point',
    coordinates: [470267, 122765],
  },
  physical_type: PhysicalType.FBM,
  current_use: CurrentUse.NONE,
  historic_use: HistoricUse.FBM,
  condition: TrigCondition.GOOD,
  status: Status.PILLAR,
};

const trigArray = [{ trig01 }, { trig01 }];

describe('TrigsService', () => {
  let service: TrigsService;
  let repository: Repository<Trig>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoordsService,
        TrigsService,
        {
          provide: getRepositoryToken(Trig),
          useValue: {
            find: jest.fn().mockResolvedValue(trigArray),
            findOne: jest.fn().mockResolvedValue(trig01),
            save: jest.fn().mockResolvedValue(trig01),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TrigsService>(TrigsService);
    repository = module.get<Repository<Trig>>(getRepositoryToken(Trig));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('given a dto with missing osgb coords', async () => {
      // arrange
      const test1Dto: CreateTrigDto = {
        id: 1,
        name: 'trig',
        wgs_lat: 51,
        wgs_lon: -1,
        osgb_eastings: null,
        osgb_northings: null,
        physical_type: PhysicalType.FBM,
        current_use: CurrentUse.NONE,
        historic_use: HistoricUse.FBM,
        condition: TrigCondition.GOOD,
        status: Status.PILLAR,
      };

      //act
      const r1 = await service.create(test1Dto);

      //assert
      expect(r1).toEqual(trig01);
    });

    it('given a dto with missing wgs coords', () => {
      const trig2Dto: CreateTrigDto = {
        id: 1,
        name: 'trig',
        wgs_lat: null,
        wgs_lon: null,
        osgb_eastings: 470267.34536504897,
        osgb_northings: 122765.53816158895,
        physical_type: PhysicalType.FBM,
        current_use: CurrentUse.NONE,
        historic_use: HistoricUse.FBM,
        condition: TrigCondition.GOOD,
        status: Status.PILLAR,
      };
      const repoSpy = jest.spyOn(repository, 'save');

      const r2 = service.create(trig2Dto);

      expect(r2).resolves.toEqual(trig01);
    });
  });
});
