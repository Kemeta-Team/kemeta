import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';

import { generateTokens } from '../../utils/Token';

// import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    // private readonly emailService: EmailService,
  ) {}

  // =========================
  // Helpers
  // =========================

  private toSafeUser(user: any) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  private generateNumericCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * OTP بدون تخزينه في الداتا بيز:
   * الكود بيتحط جوه JWT موقّع بمدة صلاحية قصيرة، وبيتبعت للمستخدم كرقم عادي عن طريق الإيميل.
   * التوكن نفسه (اللي فيه الكود) بيترجع في الـ response عشان الفرونت يخزنه مؤقتًا
   * ويرجعه مع الـ verify-otp request.
   */
  private generateOtpToken(userId: string, code: string, type: string) {
    const secret = this.configService.get<string>('OTP_SECRET') || 'default-otp-secret';
    const rawExpiry = this.configService.get<string>('OTP_EXPIRY');
    // allow numeric seconds or string like '2m'
    const expiresIn: string | number = rawExpiry && !Number.isNaN(Number(rawExpiry))
      ? Number(rawExpiry)
      : (rawExpiry || '2m');

    return this.jwtService.sign(
      { sub: userId, code, type },
      {
        secret,
        // cast to any to satisfy differing library typings
        expiresIn: expiresIn as any,
      },
    );
  }

  private verifyOtpToken(otpToken: string) {
    try {
      return this.jwtService.verify(otpToken, {
        secret: this.configService.get<string>('OTP_SECRET'),
      });
    } catch {
      throw new BadRequestException('OTP expired or invalid');
    }
  }

  // =========================
  // Register
  // =========================

  async register(dto: RegisterDto) {
    const { fullName, email, password, avatar, country, language } = dto;

    const existingEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        avatar,
        country,
        language,
        role: 'USER',
      },
    });

    const otp = this.generateNumericCode();
    const otpToken = this.generateOtpToken(user.id, otp, 'EMAIL_VERIFICATION');

    // await this.emailService.sendOtpEmail({ to: email, otp, subject: 'Verify your email' });

    return {
      user: this.toSafeUser(user),
      otpToken,
    };
  }

  // =========================
  // Login
  // =========================

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const tokens = await generateTokens(this.jwtService, {
      id: user.id,
      role: user.role,
      email: user.email,
    });

    return {
      user: this.toSafeUser(user),
      tokens,
    };
  }

  // =========================
  // Logout
  // =========================

  async logout(_refreshToken?: string) {
    // ملحوظة: بما إن مفيش جدول RefreshToken، مينفعش نعمل "إلغاء" حقيقي للتوكن.
    // الكنترولر هيمسح الكوكيز بس، والتوكن هيفضل صالح لحد ما ينتهي عمره طبيعيًا.
    return;
  }

  // =========================
  // Refresh Token
  // =========================

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    let decoded: any;

    try {
      decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: decoded.sub },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const tokens = await generateTokens(this.jwtService, {
      id: user.id,
      role: user.role,
      email: user.email,
    });

    return {
      user: this.toSafeUser(user),
      tokens,
    };
  }

  // =========================
  // Verify OTP
  // =========================

  async verifyOtp(dto: VerifyOtpDto) {
    const { otp, otpToken } = dto as any;

    if (!otp || !otpToken) {
      throw new BadRequestException('OTP and otpToken are required');
    }

    const decoded = this.verifyOtpToken(otpToken);

    if (decoded.code !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

  
    return { verified: true };
  }

  // =========================
  // Resend OTP
  // =========================

  async resendOtp(dto: ResendOtpDto) {
    const { email } = dto as any;

    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = this.generateNumericCode();
    const otpToken = this.generateOtpToken(user.id, otp, 'EMAIL_VERIFICATION');

    // await this.emailService.sendOtpEmail({ to: email, otp, subject: 'New OTP Verification Code' });

    return { otpToken };
  }

  // =========================
  // Forget Password
  // =========================

  async forgetPassword(dto: ForgetPasswordDto) {
    const { email } = dto as any;

    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = this.jwtService.sign(
      { sub: user.id } as any,
      {
        secret: this.configService.get<string>('RESET_PASSWORD_SECRET'),
        expiresIn:
          this.configService.get<string>('RESET_PASSWORD_EXPIRY') || '5m',
      } as any,
    );

    const resetLink = `${this.configService.get<string>(
      'FRONTEND_URL',
    )}/reset-password/${resetToken}`;

    // await this.emailService.sendResetPasswordEmail(email, resetLink);

    return { resetLink };
  }

  // =========================
  // Reset Password
  // =========================

  async resetPassword(dto: ResetPasswordDto) {
    const { resetToken, newPassword } = dto as any;

    if (!resetToken || !newPassword) {
      throw new BadRequestException('Missing required fields');
    }

    let decoded: any;

    try {
      decoded = this.jwtService.verify(resetToken, {
        secret: this.configService.get<string>('RESET_PASSWORD_SECRET'),
      });
    } catch {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: decoded.sub },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { success: true };
  }

  // =========================
  // Find All Users
  // =========================

  async findUsers() {
    const users = await this.prisma.user.findMany();

    if (!users.length) {
      throw new NotFoundException('No users found');
    }

    return users.map((user) => this.toSafeUser(user));
  }

  // =========================
  // Delete Account (hard delete - مفيش deletedAt)
  // =========================

  async deleteAccount(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({ where: { id: userId } });

    return { success: true };
  }

  // =========================
  // Google OAuth
  // =========================

  async loginWithGoogle(googleUser: {
    email: string;
    fullName: string;
    avatar?: string;
  }) {
    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      const randomPassword = await bcrypt.hash(
        Math.random().toString(36).slice(-12),
        10,
      );

      user = await this.prisma.user.create({
        data: {
          fullName: googleUser.fullName,
          email: googleUser.email,
          password: randomPassword,
          avatar: googleUser.avatar,
          role: 'USER',
        },
      });
    }

    const tokens = await generateTokens(this.jwtService, {
      id: user.id,
      role: user.role,
      email: user.email,
    });

    return {
      user: this.toSafeUser(user),
      tokens,
    };
  }
}