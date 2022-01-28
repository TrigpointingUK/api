import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { Photo } from './entities/photo.entity';
import { PhotosController } from './photos.controller';
import { PhotosModule } from './photos.module';
import { PhotosService } from './photos.service';

const photo01: Photo = {
  id: 1,
} as Photo;
const newPhoto: CreatePhotoDto = {} as CreatePhotoDto;
const updatePhoto: UpdatePhotoDto = {} as UpdatePhotoDto;
const photoArray = [{ photo01 }, { photo01 }];

describe('PhotosController', () => {
  let controller: PhotosController;
  let service: PhotosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhotosController],
      providers: [
        PhotosService,
        {
          provide: getRepositoryToken(Photo),
          useValue: {
            find: jest.fn().mockResolvedValue(photoArray),
            findOne: jest.fn().mockResolvedValue(photo01),
            findOneOrFail: jest.fn().mockResolvedValue(photo01),
            save: jest.fn().mockResolvedValue(photo01),
            remove: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PhotosController>(PhotosController);
    service = module.get<PhotosService>(PhotosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('crud', () => {
    test('create should return a photo', async () => {
      expect(await controller.create(newPhoto)).toBe(photo01);
    });
    it('findAll should return an array of logs', async () => {
      expect(await controller.findAll()).toBe(photoArray);
    });
    it('findRecent should return an array of logs', async () => {
      expect(await controller.findRecent()).toBe(photoArray);
    });
    it('findById should return a single log', async () => {
      expect(await controller.findById(1)).toBe(photo01);
    });

    it('update should be supported', async () => {
      expect(await controller.update(1, updatePhoto)).toBe(photo01);
    });
    it('remove should return void', async () => {
      expect(await controller.remove(1)).toBe(undefined);
    });
  });
});
