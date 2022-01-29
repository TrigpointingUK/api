import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CoordsService } from 'src/coords/coords.service';
import { TrigsService } from 'src/trigs/trigs.service';
import { Repository } from 'typeorm';
import { Log } from '../logs/entities/log.entity';
import { Trig } from '../trigs/entities/trig.entity';
import { User } from '../users/entities/user.entity';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
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
const createPhoto: CreatePhotoDto = {
  name: 'initial name',
  description: 'initial description',
};
const updPhoto: UpdatePhotoDto = { description: 'updated' };

const trig01: Trig = {
  id: 1,
  name: 'trig',
} as Trig;

const trigArray = [{ trig01 }, { trig01 }];

describe('PhotosService', () => {
  let service: PhotosService;
  let trigsService: TrigsService;
  let repository: Repository<Photo>;

  let repoSaveSpy: jest.SpyInstance;
  let repoDeleteSpy: jest.SpyInstance;
  let repoFindSpy: jest.SpyInstance;
  let repoFindOneSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoordsService,
        PhotosService,
        {
          provide: getRepositoryToken(Photo),
          useValue: {
            find: jest.fn().mockResolvedValue(photoArray),
            findOne: jest.fn().mockResolvedValue(photo01),
            save: jest.fn().mockResolvedValue(photo01),
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

    service = module.get<PhotosService>(PhotosService);
    trigsService = module.get<TrigsService>(TrigsService);
    repository = module.get<Repository<Photo>>(getRepositoryToken(Photo));

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
    it('should create a new photo', async () => {
      const r1 = await service.create(createPhoto);
      expect(r1).toEqual(photo01);
      expect(repoSaveSpy).toHaveBeenCalled();
    });
    // it('should fail to create a photo for an invalid trigpoint', async () => {
    //   expect(trigsService).toBeDefined();
    //   jest.spyOn(trigsService, 'findById').mockImplementation(() => undefined);
    //   await expect(service.create(createPhoto)).rejects.toEqual(
    //     expect.any(NotFoundException),
    //   );
    //   expect(repoSaveSpy).not.toHaveBeenCalled();
    // });
  });

  describe('read', () => {
    it('should find all photos', async () => {
      const r1 = await service.findAll();
      expect(r1).toEqual(photoArray);
      expect(repoFindSpy).toHaveBeenCalled();
    });
    it('should find a single photo', async () => {
      const r1 = await service.findById(1);
      expect(r1).toEqual(photo01);
      expect(repoFindOneSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update records', async () => {
      const r1 = await service.update(1, updPhoto);
      expect(r1).toEqual(photo01);
      expect(repoSaveSpy).toHaveBeenCalledWith({
        id: 1,
        description: 'updated',
      });
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
