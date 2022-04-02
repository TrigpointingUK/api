import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Server } from './entities/server.entity';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';
import { server01, serverArray } from './servers.service.spec'

describe('ServersController', () => {
  let controller: ServersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServersController],
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
      ],    }).compile();

    controller = module.get<ServersController>(ServersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
