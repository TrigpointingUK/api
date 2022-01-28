import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Trig } from '../trigs/entities/trig.entity';

import { Log } from './entities/log.entity';

import { LogsService } from './logs.service';
import { TrigsService } from '../trigs/trigs.service';
import { CoordsService } from 'src/coords/coords.service';
import { Repository } from 'typeorm';
import { UpdateLogDto } from './dto/update-log.dto';
import { CreateLogDto } from './dto/create-log.dto';
import { NotFoundException } from '@nestjs/common';

const log01: Log = {
  id: 1,
  trig: new Trig(),
  text: '',
  photos: [],
};

const logArray = [{ log01 }, { log01 }];
const createLog: CreateLogDto = {
  text: 'initial text',
  id: 0,
  trig_id: 0,
};
const updLog: UpdateLogDto = { text: 'updated' };

const trig01: Trig = {
  id: 1,
  name: 'trig',
} as Trig;

const trigArray = [{ trig01 }, { trig01 }];

describe('LogsService', () => {
  let service: LogsService;
  let trigsService: TrigsService;
  let repository: Repository<Log>;

  let repoSaveSpy: jest.SpyInstance;
  let repoDeleteSpy: jest.SpyInstance;
  let repoFindSpy: jest.SpyInstance;
  let repoFindOneSpy: jest.SpyInstance;

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
            softDelete: jest.fn(),
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
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LogsService>(LogsService);
    trigsService = module.get<TrigsService>(TrigsService);
    repository = module.get<Repository<Log>>(getRepositoryToken(Log));

    repoFindSpy = jest.spyOn(repository, 'find');
    repoFindOneSpy = jest.spyOn(repository, 'findOne');
    repoSaveSpy = jest.spyOn(repository, 'save');
    repoDeleteSpy = jest.spyOn(repository, 'softDelete');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new log', async () => {
      const r1 = await service.create(createLog);
      expect(r1).toEqual(log01);
      expect(repoSaveSpy).toHaveBeenCalled();
    });
    it('should fail to create a log for an invalid trigpoint', async () => {
      expect(trigsService).toBeDefined();
      jest.spyOn(trigsService, 'findById').mockImplementation(() => undefined);
      await expect(service.create(createLog)).rejects.toEqual(
        expect.any(NotFoundException),
      );
      expect(repoSaveSpy).not.toHaveBeenCalled();
    });
  });

  describe('read', () => {
    it('should find all logs', async () => {
      const r1 = await service.findAll();
      expect(r1).toEqual(logArray);
      expect(repoFindSpy).toHaveBeenCalled();
    });
    it('should find a single log', async () => {
      const r1 = await service.findById(1);
      expect(r1).toEqual(log01);
      expect(repoFindOneSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update records', async () => {
      const r1 = await service.update(1, updLog);
      expect(r1).toEqual(log01);
      expect(repoSaveSpy).toHaveBeenCalledWith({ id: 1, text: 'updated' });
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
