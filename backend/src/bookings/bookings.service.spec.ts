import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

describe('BookingsService', () => {
  let service: BookingsService;
  let mockRepository: jest.Mocked<Repository<Booking>>;

  beforeEach(async () => {
    mockRepository = {
      count: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<Repository<Booking>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockRepository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(10),
          },
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = { name: 'John', email: 'john@test.com' };

    it('should create booking successfully', async () => {
      mockRepository.count.mockResolvedValue(5);
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(createDto as Booking);
      mockRepository.save.mockResolvedValue({ id: 1, ...createDto } as Booking);

      const result = await service.create(createDto);

      expect(result.message).toContain('จองที่นั่งสำเร็จ');
      expect(result.booking).toBeDefined();
    });

    it('should throw BadRequestException when capacity is full', async () => {
      mockRepository.count.mockResolvedValue(10);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ConflictException when email already exists', async () => {
      mockRepository.count.mockResolvedValue(5);
      mockRepository.findOne.mockResolvedValue({
        id: 1,
        name: 'Other',
        email: 'john@test.com',
        createdAt: new Date(),
      } as Booking);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException when name already exists', async () => {
      mockRepository.count.mockResolvedValue(5);
      mockRepository.findOne.mockResolvedValue({
        id: 1,
        name: 'John',
        email: 'other@test.com',
        createdAt: new Date(),
      } as Booking);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return bookings with available seats', async () => {
      const mockBookings = [
        { id: 1, name: 'John', email: 'john@test.com', createdAt: new Date() },
        { id: 2, name: 'Jane', email: 'jane@test.com', createdAt: new Date() },
      ] as Booking[];
      mockRepository.find.mockResolvedValue(mockBookings);

      const result = await service.findAll();

      expect(result.bookings).toEqual(mockBookings);
      expect(result.count).toBe(2);
      expect(result.availableSeats).toBe(8);
      expect(result.status).toBe('available');
    });

    it('should return full status when no seats available', async () => {
      const mockBookings = Array(10).fill({
        id: 1,
        name: 'Test',
        email: 'test@test.com',
        createdAt: new Date(),
      }) as Booking[];
      mockRepository.find.mockResolvedValue(mockBookings);

      const result = await service.findAll();

      expect(result.count).toBe(10);
      expect(result.availableSeats).toBe(0);
      expect(result.status).toBe('full');
    });
  });

  describe('remove', () => {
    it('should remove booking successfully', async () => {
      const mockBooking = {
        id: 1,
        name: 'John',
        email: 'john@test.com',
        createdAt: new Date(),
      } as Booking;
      mockRepository.findOne.mockResolvedValue(mockBooking);
      mockRepository.remove.mockResolvedValue(mockBooking);
      const removeSpy = jest.spyOn(mockRepository, 'remove');

      const result = await service.remove('john@test.com');

      expect(result.message).toContain('ยกเลิกการจองแล้ว');
      expect(removeSpy).toHaveBeenCalledWith(mockBooking);
    });

    it('should throw NotFoundException when booking not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('notfound@test.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
