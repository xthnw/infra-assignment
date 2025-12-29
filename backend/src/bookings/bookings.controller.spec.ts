import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

describe('BookingsController', () => {
  let controller: BookingsController;
  let service: BookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create method', async () => {
    const dto = { name: 'Test', email: 'test@test.com' };
    const createSpy = jest.spyOn(service, 'create');

    await controller.create(dto);

    expect(createSpy).toHaveBeenCalledWith(dto);
  });

  it('should call findAll method', async () => {
    const findAllSpy = jest.spyOn(service, 'findAll');

    await controller.findAll();

    expect(findAllSpy).toHaveBeenCalled();
  });

  it('should call remove method', async () => {
    const removeSpy = jest.spyOn(service, 'remove');

    await controller.remove('test@test.com');

    expect(removeSpy).toHaveBeenCalledWith('test@test.com');
  });
});
