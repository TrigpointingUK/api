import { Test, TestingModule } from '@nestjs/testing';
import { CreateTrigDto } from './dto/create-trig.dto';
import { TrigsController } from './trigs.controller';
import { TrigsService } from './trigs.service';
import { Trig } from './entities/trig.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateTrigDto } from './dto/update-trig.dto';
import { CoordsService } from 'src/coords/coords.service';

const trig01: Trig = {
  id: 1,
} as Trig;
const newTrig: CreateTrigDto = {} as CreateTrigDto;
const updateTrig: UpdateTrigDto = {} as UpdateTrigDto;
const trigArray = [{ trig01 }, { trig01 }];

describe('TrigsController', () => {
  let controller: TrigsController;
  let service: TrigsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrigsController],
      providers: [
        TrigsService,
        CoordsService,
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

    controller = module.get<TrigsController>(TrigsController);
    service = module.get<TrigsService>(TrigsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('crud', () => {
    test('create should return a trig', async () => {
      expect(await controller.create(newTrig)).toBe(trig01);
    });
    it('findAll should return an array of trigs', async () => {
      expect(await controller.findAll()).toBe(trigArray);
    });
    it('findById should return a single trig', async () => {
      expect(await controller.findById(1)).toBe(trig01);
    });

    it('update should be supported', async () => {
      expect(await controller.update(1, updateTrig)).toBe(trig01);
    });
    it('remove should return void', async () => {
      expect(await controller.remove(1)).toBe(undefined);
    });
  });
});
