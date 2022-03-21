import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { createMock } from '@golevelup/ts-jest';
import { Licence, Status, Units } from 'src/enum_types';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Request } from 'express';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
const userArray = [{ user01 }, { user01 }];
const emptyRequest = createMock<Request>() as Request;
const newUser: CreateUserDto = {
  id: 1,
  nickname: '',
  email: '',
  email_verified: false,
  oauth: '',
  firstname: '',
  lastname: '',
  about: '',
  homepage: '',
  avatar: '',
  units: Units.METRIC,
  status_max: Status.PILLAR,
  licence_default: Licence.PUBLIC_DOMAIN,
  mobile_number: "0",
  cryptpw: '',
};
const updateUser: UpdateUserDto = {
  id: 1,
  nickname: 'newnickname',
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
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

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('crud', () => {
    test('create should return a single user', async () => {
      expect(await controller.create(newUser)).toBe(user01);
    });
    it('findAll should return an array of users', async () => {
      expect(await controller.findAll()).toBe(userArray);
    });
    it('findById should return a single user', async () => {
      expect(await controller.findById(1)).toBe(user01);
    });
    it('getMyUser should abort if no request data', async () => {
      await expect(controller.getMyUser(emptyRequest)).rejects.toEqual(
        expect.any(NotFoundException),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('ERROR: oauthUser not provided'),
      );
    });
    it('updateMyUser should abort if no request data', async () => {
      await expect(
        controller.updateMyUser(emptyRequest, updateUser),
      ).rejects.toEqual(expect.any(NotFoundException));
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('ERROR: oauthUser not provided'),
      );
    });
    it('remove should return void', async () => {
      expect(await controller.remove(1)).toBe(undefined);
    });
  });
});
