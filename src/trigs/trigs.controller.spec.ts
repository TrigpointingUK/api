import { Test, TestingModule } from '@nestjs/testing';
import { CreateTrigDto } from './dto/create-trig.dto';
import { TrigsController } from './trigs.controller';
import { TrigsService } from './trigs.service';

describe('TrigsController', () => {
  let trigsController: TrigsController;
  let trigsService: TrigsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrigsController],
      providers: [
        TrigsService,
        {
          provide: TrigsService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((trig: CreateTrigDto) =>
                Promise.resolve({ id: '1', ...trig }),
              ),
            findAll: jest.fn().mockResolvedValue([
              {
                firstName: 'firstName #1',
                lastName: 'lastName #1',
              },
              {
                firstName: 'firstName #2',
                lastName: 'lastName #2',
              },
            ]),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                firstName: 'firstName #1',
                lastName: 'lastName #1',
                id,
              }),
            ),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    trigsController = module.get<TrigsController>(TrigsController);
    trigsService = module.get<TrigsService>(TrigsService);
  });

  it('should be defined', () => {
    expect(trigsController).toBeDefined();
  });
});
