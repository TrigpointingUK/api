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
import { UpdateTrigDto } from './dto/update-trig.dto';
import _ from 'lodash';

const trig01: Trig = {
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
} as Trig;

let trig02 = new Trig();
trig02.id = 2;
trig02.name = 'Test 2';

const updTrig: UpdateTrigDto = { name: 'updated' };
const trigArray = [{ trig01 }, { trig01 }];

describe('TrigsService', () => {
  let service: TrigsService;
  let repository: Repository<Trig>;

  let repoSaveSpy: jest.SpyInstance;
  let repoDeleteSpy: jest.SpyInstance;
  let repoFindSpy: jest.SpyInstance;
  let repoFindOneSpy: jest.SpyInstance;

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
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TrigsService>(TrigsService);
    repository = module.get<Repository<Trig>>(getRepositoryToken(Trig));

    repoFindSpy = jest.spyOn(repository, 'find');
    repoFindOneSpy = jest.spyOn(repository, 'findOne');
    repoSaveSpy = jest.spyOn(repository, 'save');
    repoDeleteSpy = jest.spyOn(repository, 'softDelete');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
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

      const r2 = service.create(trig2Dto);
      expect(r2).resolves.toEqual(trig01);
    });
  });

  describe('read', () => {
    it('should find all trigpoints', async () => {
      const r1 = await service.findAll();
      expect(r1).toEqual(trigArray);
      expect(repoFindSpy).toHaveBeenCalledWith();
    });
    it('should find a single trigpoint', async () => {
      const r1 = await service.findById(1);
      expect(r1).toEqual(trig01);
      expect(repoFindOneSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('entity', () => {
    it('should construct waypoint string', () => {
      expect(trig02.waypoint).toEqual('TP0002');
    });
    it('should construct fullName string', () => {
      expect(trig02.fullName).toEqual('TP0002 - Test 2');
    });
  });

  describe('update', () => {
    it('should update records', async () => {
      const r1 = await service.update(1, updTrig);
      expect(r1).toEqual(trig01);
      expect(repoSaveSpy).toHaveBeenCalledWith({ id: 1, name: 'updated' });
    });
  });

  describe('delete', () => {
    it('should delete records', async () => {
      const r1 = await service.remove(1);
      expect(r1).toBeUndefined();
      expect(repoDeleteSpy).toHaveBeenCalledWith(1);
    });
  });
});
