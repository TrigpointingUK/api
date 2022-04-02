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
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Licence, LogSource, Status, TrigCondition, Units } from 'src/enum_types';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { MyUserDto } from 'src/users/dto/my-user.dto';

const trig01: Trig = {
  id: 1,
  name: 'trig',
} as Trig;

const trigArray = [{ trig01 }, { trig01 }];



const user01: User = {
  id: 1,
  nickname: 'user1',
  email: 'email1@example.com',
  email_verified: true,
  oauth: 'testoauth',
  firstname: 'Test',
  lastname: 'User',
  about: 'about me',
  homepage: 'http://example.com',
  avatar: 'http://avatar.com/avatar1',
  units: Units.METRIC,
  status_max: Status.CONTROVERSIAL,
  licence_default: Licence.PUBLIC_DOMAIN,
  mobile_number: "1234567890",
  cryptpw: 'verysecret',
  uuid: 'uuid01',
  logs: [],
  photos: [],
};


const log01: Log = {
  id: 1,
  trig: trig01,
  user: user01,
  visit_timestamp: new Date("2022-03-21 20:59:23"),
  comment: "log01",
  wgs_lat: 51,
  wgs_lon: -1,
  wgs_height: 0,
  osgb_eastings: 470267.35,
  osgb_northings: 122765.54,
  osgb_gridref: "SU 70267 22765",
  osgb_height: 0,
  wgs_point: { type: 'Point', coordinates: [-1, 51] },
  osgb_point: {
    type: 'Point',
    coordinates: [470267.35, 122765.54],
  },
  fb_number: "fb01",
  condition: TrigCondition.GOOD,
  source: LogSource.UNKNOWN,
  deletedAt: null,
  score: 0,
  crt_user: new User
};

export const logArray = [{ log01 }, { log01 }];
export const createLog01: CreateLogDto = {
  id: 1,
  trig_id: 1,
  user_id: 1,
  visit_date: "2022-03-21",
  visit_time: "20:59:23",
  visit_timestamp: null,
  comment: "log01",
  wgs_lat: 51,
  wgs_lon: -1,
  wgs_height: 0,
  osgb_eastings: null,
  osgb_northings: null,
  osgb_height: 0,
  osgb_gridref: null,
  fb_number: "fb01",
  condition: TrigCondition.GOOD,
  source: LogSource.UNKNOWN

};
export const createLog02: CreateLogDto = {
  id: 1,
  trig_id: 1,
  user_id: 1,
  visit_date: "",
  visit_time: null,
  visit_timestamp: new Date("2022-03-21 20:59:23"),
  comment: "log01",
  wgs_lat: null,
  wgs_lon: null,
  wgs_height: 0,
  osgb_eastings: 470267.34536504897,
  osgb_northings: 122765.53816158895,
  osgb_height: 0,
  osgb_gridref: null,
  fb_number: "fb01",
  condition: TrigCondition.GOOD,
  source: LogSource.UNKNOWN

};

export const updLog: UpdateLogDto = { comment: 'updated' };








const user01Dto: CreateUserDto = {
  id: 1,
  nickname: 'user1',
  email: 'email1@example.com',
  email_verified: true,
  oauth: 'testoauth',
  firstname: 'Test',
  lastname: 'User',
  about: 'about me',
  homepage: 'http://example.com',
  avatar: 'http://avatar.com/avatar1',
  units: Units.METRIC,
  status_max: Status.CONTROVERSIAL,
  licence_default: Licence.PUBLIC_DOMAIN,
  mobile_number: "1234567890",
  cryptpw: 'verysecret',
};

const myUser01Dto: MyUserDto = {
  id: 1,
  nickname: 'user1',
  email: 'email1@example.com',
  email_verified: true,
  firstname: 'Test',
  lastname: 'User',
  about: 'about me',
  homepage: 'http://example.com',
  avatar: 'http://avatar.com/avatar1',
  units: Units.METRIC,
  status_max: Status.CONTROVERSIAL,
  licence_default: Licence.PUBLIC_DOMAIN,
  mobile_number: "1234567890",
};

const updateMyUser01: UpdateUserDto = {
  nickname: 'NewNickname',
};

const auth0ResultsUser01: Object = {
  sub: 'mockauth0',
  picture: 'http://avatar.com/avatar1',
  email: 'email1@example.com',
  email_verified: true,
  given_name: 'Test',
  family_name: 'User',
};

const userArray = [{ user01 }, { user01 }];




describe('LogsService', () => {
  let service: LogsService;
  let trigsService: TrigsService;
  let usersService: UsersService;
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
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn().mockResolvedValue(userArray),
            findOne: jest.fn().mockResolvedValue(user01),
            save: jest.fn().mockResolvedValue(user01),
            remove: jest.fn(),
            softDelete: jest.fn(),
          },
        },        
      ],
    }).compile();

    service = module.get<LogsService>(LogsService);
    trigsService = module.get<TrigsService>(TrigsService);
    usersService = module.get<UsersService>(UsersService);
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
    it('should create a new log, given wgs coords and a date', async () => {
      const r1 = await service.create(createLog01);
      expect(r1).toEqual(log01);
      expect(repoSaveSpy).toHaveBeenCalledWith(expect.objectContaining({
        "comment": "log01",
        "visit_timestamp": new Date("2022-03-21 20:59:23"),
        "osgb_gridref": "SU 70267 22765",
      }));
    });
    it('should create a new log, given osgb coords and a timestamp', async () => {
      const r1 = await service.create(createLog02);
      expect(r1).toEqual(log01);
      expect(repoSaveSpy).toHaveBeenCalledWith(expect.objectContaining({
        "comment": "log01",
        "visit_timestamp": new Date("2022-03-21 20:59:23"),
        "wgs_lat": 51,
      }));

    });
    it('should fail to create a log for an invalid trigpoint', async () => {
      expect(trigsService).toBeDefined();
      jest.spyOn(trigsService, 'findById').mockImplementation(() => undefined);
      await expect(service.create(createLog01)).rejects.toEqual(
        expect.any(NotFoundException),
      );
      expect(repoSaveSpy).not.toHaveBeenCalled();
    });
    it('should fail to create a log for an invalid user', async () => {
      expect(usersService).toBeDefined();
      jest.spyOn(usersService, 'findById').mockImplementation(() => undefined);
      await expect(service.create(createLog01)).rejects.toEqual(
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
      expect(repoSaveSpy).toHaveBeenCalledWith({ id: 1, comment: 'updated' });
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
