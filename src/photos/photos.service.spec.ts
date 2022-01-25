import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Log } from '../logs/entities/log.entity';
import { Trig } from '../trigs/entities/trig.entity';
import { User } from '../users/entities/user.entity';
import { Photo } from './entities/photo.entity';
import { PhotosService } from './photos.service';

const photo01: Photo = {
  id: 1,
  trig: new Trig(),
  user: new User(),
  log: new Log(),
  caption: '',
  width: 0,
  height: 0,
};

const photoArray = [{ photo01 }, { photo01 }];

describe('PhotosService', () => {
  let service: PhotosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotosService,
        {
          provide: getRepositoryToken(Photo),
          useValue: {
            find: jest.fn().mockResolvedValue(photoArray),
            findOne: jest.fn().mockResolvedValue(photo01),
            save: jest.fn().mockResolvedValue(photo01),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PhotosService>(PhotosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
