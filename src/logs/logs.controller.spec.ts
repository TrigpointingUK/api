import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CoordsService } from 'src/coords/coords.service';
import { CreateTrigDto } from 'src/trigs/dto/create-trig.dto';
import { UpdateTrigDto } from 'src/trigs/dto/update-trig.dto';
import { Trig } from 'src/trigs/entities/trig.entity';
import { TrigsService } from 'src/trigs/trigs.service';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { Log } from './entities/log.entity';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';

const log01: Log = {
  id: 1,
} as Log;
const newLog: CreateLogDto = {} as CreateLogDto;
const updateLog: UpdateLogDto = {} as UpdateLogDto;
const logArray = [{ log01 }, { log01 }];

const trig01: Trig = {
  id: 1,
} as Trig;
const newTrig: CreateTrigDto = {} as CreateTrigDto;
const updateTrig: UpdateTrigDto = {} as UpdateTrigDto;
const trigArray = [{ trig01 }, { trig01 }];

describe('LogsController', () => {
  let controller: LogsController;
  let service: LogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogsController],
      providers: [
        LogsService,
        TrigsService,
        CoordsService,
        {
          provide: getRepositoryToken(Log),
          useValue: {
            find: jest.fn().mockResolvedValue(logArray),
            findOne: jest.fn().mockResolvedValue(log01),
            findOneOrFail: jest.fn().mockResolvedValue(log01),
            save: jest.fn().mockResolvedValue(log01),
            remove: jest.fn(),
            softDelete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Trig),
          useValue: {
            find: jest.fn().mockResolvedValue(trigArray),
            findOne: jest.fn().mockResolvedValue(trig01),
            findOneOrFail: jest.fn().mockResolvedValue(trig01),
            save: jest.fn().mockResolvedValue(trig01),
            remove: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LogsController>(LogsController);
    service = module.get<LogsService>(LogsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('crud', () => {
    test('create should return a log', async () => {
      expect(await controller.create(newLog)).toBe(log01);
    });
    it('findAll should return an array of logs', async () => {
      expect(await controller.findAll()).toBe(logArray);
    });
    it('findRecent should return an array of logs', async () => {
      expect(await controller.findRecent()).toBe(logArray);
    });
    it('findById should return a single log', async () => {
      expect(await controller.findById(1)).toBe(log01);
    });

    it('update should be supported', async () => {
      expect(await controller.update(1, updateLog)).toBe(log01);
    });
    it('remove should return void', async () => {
      expect(await controller.remove(1)).toBe(undefined);
    });
  });
});
