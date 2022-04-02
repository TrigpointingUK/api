import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Server } from './entities/server.entity';
import { ServersService } from './servers.service';

export const server01: Server = {
  id: 1,
  url: 'http://server1',
  path: '/server1',
  description: 'Server number 1'
} as Server;

export const serverArray = [{ server01 }, { server01 }];


describe('ServersService', () => {
  let service: ServersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServersService,
        {
          provide: getRepositoryToken(Server),
          useValue: {
            find: jest.fn().mockResolvedValue(serverArray),
            findOne: jest.fn().mockResolvedValue(server01),
            save: jest.fn().mockResolvedValue(server01),
            remove: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ServersService>(ServersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
