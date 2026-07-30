import {
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class VerifyOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  otp: string;

  @IsOptional()
  @IsString()
  type?: string = 'EMAIL_VERIFICATION';
}