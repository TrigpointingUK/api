import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  TrigCondition,
  CurrentUse,
  HistoricUse,
  PhysicalType,
  Status,
} from 'src/enum_types';
import { Trig } from '../trigs/entities/trig.entity';

import { Log } from './entities/log.entity';

import { LogsService } from './logs.service';
import { TrigsService } from '../trigs/trigs.service';
import { CoordsService } from 'src/coords/coords.service';

const log01: Log = {
  id: 1,
  trig: new Trig(),
  text: '',
  photos: [],
};

const logArray = [{ log01 }, { log01 }];

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

describe('LogsService', () => {
  let service: LogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoordsService,
        LogsService,
        {
          provide: getRepositoryToken(Log),
          useValue: {
            find: jest.fn().mockResolvedValue(logArray),
            findOne: jest.fn().mockResolvedValue(log01),
            save: jest.fn().mockResolvedValue(log01),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
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

    service = module.get<LogsService>(LogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
