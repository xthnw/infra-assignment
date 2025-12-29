import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  private readonly CAPACITY: number;

  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private configService: ConfigService,
  ) {
    const capacityEnv = this.configService.get<number>('BOOKING_CAPACITY');
    this.CAPACITY = Number(capacityEnv) || 10;
  }

  // จองตั๋ว
  async create(createBookingDto: CreateBookingDto) {
    const { name, email } = createBookingDto;
    // check 1: ที่นั่งเต็มหรือยัง?
    const currentCount = await this.bookingRepository.count();
    if (currentCount >= this.CAPACITY) {
      throw new BadRequestException('ขณะนี้ที่นั่งเต็มแล้ว');
    }

    // check 2: ชื่อหรืออีเมลนี้จองไปหรือยัง (ห้ามซ้ำ)
    const existingBooking = await this.bookingRepository.findOne({
      where: [{ email: email }, { name: name }],
    });

    if (existingBooking) {
      if (existingBooking.email === email) {
        throw new ConflictException(`${email} อีเมลนี้ถูกใช้ในการจองไปแล้ว`);
      }
      if (existingBooking.name === name) {
        throw new ConflictException(`${name} ชื่อนี้ถูกใช้ในการจองไปแล้ว`);
      }
    }

    // ผ่านหมด Save ลง Database
    const newBooking = this.bookingRepository.create(createBookingDto);
    await this.bookingRepository.save(newBooking);

    return {
      message: `${name} จองที่นั่งสำเร็จ`,
      booking: newBooking,
    };
  }

  // ดูรายชื่อ + จำนวนว่าง
  async findAll() {
    const bookings = await this.bookingRepository.find({
      order: { createdAt: 'DESC' }, // เรียงใหม่ไปเก่า
    });
    const count = bookings.length;
    const availableSeats = this.CAPACITY - count;

    return {
      bookings,
      count,
      availableSeats,
      status: availableSeats > 0 ? 'available' : 'full',
    };
  }

  // 3. ยกเลิก (ใช้อีเมล)
  async remove(email: string) {
    const booking = await this.bookingRepository.findOne({ where: { email } });

    if (!booking) {
      throw new NotFoundException('ไม่พบข้อมูลการจองนี้');
    }

    await this.bookingRepository.remove(booking);
    return {
      message: `${booking.name} ยกเลิกการจองแล้ว มีที่นั่งว่างเพิ่ม`,
    };
  }
}
