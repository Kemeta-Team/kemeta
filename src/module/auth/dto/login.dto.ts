import {
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class ResendOtpDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  type?: string = 'EMAIL_VERIFICATION';
}