import { ImATeapotException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import axios from 'axios';
import { Status, Licence, Units } from 'src/enum_types';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { MyUserDto } from './dto/my-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

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
  mobile_number: 1234567890,
  cryptpw: 'verysecret',
  uuid: 'uuid01',
  logs: [],
  photos: [],
};

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
  mobile_number: 1234567890,
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
  mobile_number: 1234567890,
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

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

  let repoSaveSpy: jest.SpyInstance;
  let repoDeleteSpy: jest.SpyInstance;
  let repoFindSpy: jest.SpyInstance;
  let repoFindOneSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn().mockResolvedValue(userArray),
            findOne: jest.fn().mockResolvedValue(user01),
            findOneOrFail: jest.fn().mockResolvedValue(user01),
            save: jest.fn().mockResolvedValue(user01),
            remove: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));

    repoFindSpy = jest.spyOn(repository, 'find');
    repoFindOneSpy = jest.spyOn(repository, 'findOne');
    repoSaveSpy = jest.spyOn(repository, 'save');
    repoDeleteSpy = jest.spyOn(repository, 'softDelete');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //
  //
  //
  describe('create, update and delete', () => {
    it('given a dto to create', async () => {
      const r1 = service.create(user01Dto);
      expect(r1).resolves.toEqual(user01);
      expect(repoSaveSpy).toHaveBeenCalledWith(user01Dto);
    });
    it('given a dto to update', async () => {
      const r1 = service.updateMyUser('testoauth', updateMyUser01);
      await expect(r1).resolves.toEqual(user01);
      expect(repoSaveSpy).toHaveBeenCalledWith({
        id: user01.id,
        nickname: updateMyUser01.nickname,
      });
    });
    it('should throw an exception if no user provided', async () => {
      await expect(service.updateMyUser(null, updateMyUser01)).rejects.toEqual(
        expect.any(NotFoundException),
      );
      expect(repoFindOneSpy).not.toHaveBeenCalled();
    });
    it('should trigger failed assertion oauthuser - database error', async () => {
      await expect(
        service.updateMyUser('mismatch', updateMyUser01),
      ).rejects.toEqual(expect.any(ImATeapotException));
      expect(repoFindOneSpy).not.toHaveBeenCalled();
    });
    it('given a user to delete', async () => {
      const r1 = service.remove(user01.id);
      expect(r1).resolves.toBeUndefined();
      expect(repoDeleteSpy).toHaveBeenCalledWith(user01.id);
    });
  });

  //
  //
  //
  describe('find', () => {
    it('should find all users', async () => {
      const r1 = service.findAll();
      expect(r1).resolves.toEqual(userArray);
      expect(repoFindSpy).toHaveBeenCalled();
    });

    it('should find one user', async () => {
      const r1 = service.findById(user01.id);
      expect(r1).resolves.toEqual(user01);
      expect(repoFindOneSpy).toHaveBeenCalledWith(user01.id);
    });
  });

  //
  //
  //
  describe('myUser', () => {
    it('should throw an exception if no user provided', async () => {
      await expect(
        service.getMyUser(null, null, null, null, null),
      ).rejects.toEqual(expect.any(NotFoundException));
      expect(repoFindOneSpy).not.toHaveBeenCalled();
    });

    it('should find an existing user by oauthUser', async () => {
      const r1 = service.getMyUser('testoauth', null, null, null, null);
      expect(r1).resolves.toEqual(myUser01Dto);
      expect(repoFindOneSpy).toHaveBeenCalled();
    });

    it('should find an existing user by email', async () => {
      const auth0Spy = jest.spyOn(service, 'getAuth0UserDetails');
      auth0Spy.mockImplementation(
        (): Promise<Object> => Promise.resolve(auth0ResultsUser01),
      );
      const r1 = service.getMyUser(
        'nomatch',
        'email1@example.com',
        null,
        null,
        null,
      );
      await expect(r1).resolves.toEqual(myUser01Dto);
      expect(repoFindOneSpy).toHaveBeenCalled();
      expect(auth0Spy).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('User found by email');
    });

    it('should find an existing user by cookies', async () => {
      const auth0Spy = jest.spyOn(service, 'getAuth0UserDetails');
      auth0Spy.mockImplementation(
        (): Promise<Object> => Promise.resolve(auth0ResultsUser01),
      );
      const r1 = service.getMyUser(
        'nomatch',
        'nomatch',
        'verysecret',
        '1',
        null,
      );
      await expect(r1).resolves.toEqual(myUser01Dto);
      expect(repoFindOneSpy).toHaveBeenCalled();
      expect(auth0Spy).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('User found by cookies');
    });

    it('should create a new user if nothing matched', async () => {
      const auth0Spy = jest.spyOn(service, 'getAuth0UserDetails');
      auth0Spy.mockImplementation(
        (): Promise<Object> => Promise.resolve(auth0ResultsUser01),
      );
      const r1 = service.getMyUser(
        'nomatch',
        'nomatch',
        'nomatch',
        'nomatch',
        null,
      );
      await expect(r1).resolves.toEqual(myUser01Dto);
      expect(repoFindOneSpy).toHaveBeenCalled();
      expect(auth0Spy).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('New user'),
      );
    });

    it('should create a new user if email null', async () => {
      const auth0Spy = jest.spyOn(service, 'getAuth0UserDetails');
      auth0Spy.mockImplementation(
        (): Promise<Object> => Promise.resolve(auth0ResultsUser01),
      );
      const r1 = service.getMyUser('nomatch', null, 'nomatch', 'nomatch', null);
      await expect(r1).resolves.toEqual(myUser01Dto);
      expect(repoFindOneSpy).toHaveBeenCalled();
      expect(auth0Spy).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('New user'),
      );
    });
  });
  //
  //
  //
  describe('Auth0 API', () => {
    it('should return undefined when Auth0 unavailable', async () => {
      const r1 = service.getAuth0UserDetails('');
      await expect(r1).resolves.toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('failed'),
      );
    });
    it('should return a value when Auth0 mocked', async () => {
      const axiosSpy = jest
        .spyOn(axios, 'get')
        .mockImplementation(
          (): Promise<Object> => Promise.resolve({ data: auth0ResultsUser01 }),
        );
      const r1 = service.getAuth0UserDetails('');
      await expect(r1).resolves.toEqual(auth0ResultsUser01);
      expect(axiosSpy).toHaveBeenCalled();
    });
  });
});
