import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty({ message: 'กรุณากรอกชื่อ' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'กรุณากรอกอีเมล' })
  @IsEmail({}, { message: 'รูปแบบอีเมลไม่ถูกต้อง' })
  email: string;
}
