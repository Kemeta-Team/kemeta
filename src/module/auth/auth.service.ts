import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  private readonly OTP_EXPIRY_MINUTES = 2;
  private readonly RESET_PASSWORD_EXPIRY_MINUTES = 5;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  // =========================
  // Helpers
  // =========================

  private toSafeUser(user: any) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  private generateNumericCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  private generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private async findLatestOtp(userId: string, type: string) {
    return this.prisma.otpCode.findFirst({
      where: {
        userId,
        type,
        verifiedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private async invalidatePreviousOtps(userId: string, type: string) {
    await this.prisma.otpCode.deleteMany({
      where: {
        userId,
        type,
      },
    });
  }

  private async persistRefreshToken(
    userId: string,
    refreshToken: string,
  ) {
    const decoded: any = this.jwtService.decode(refreshToken);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt: new Date(decoded.exp * 1000),
      },
    });
  }

  private async revokeRefreshTokenByValue(token: string) {
    await this.prisma.refreshToken.updateMany({
      where: {
        token,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
      },
    });
  }

  // =========================
  // Register
  // =========================

  async register(dto: any) {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      whatsappPhone,
      roles,
    } = dto;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phone
    ) {
      throw new BadRequestException('Missing required fields');
    }

    const [existingEmail, existingPhone] =
      await Promise.all([
        this.prisma.user.findUnique({
          where: { email },
        }),
        this.prisma.user.findUnique({
          where: { phone },
        }),
      ]);

    if (existingEmail)
      throw new BadRequestException(
        'Email already exists',
      );

    if (existingPhone)
      throw new BadRequestException(
        'Phone already exists',
      );

    const roleName = roles || 'student';

    const role = await this.prisma.role.findUnique({
      where: {
        name: roleName,
      },
    });

    if (!role)
      throw new NotFoundException(
        'Role not found',
      );

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await this.prisma.$transaction(async (tx) => {
        const createdUser =
          await tx.user.create({
            data: {
              firstName,
              lastName,
              email,
              phone,
              whatsappPhone,
              password: hashedPassword,
              isVerified: false,
              status: 'PENDING',
            },
          });

        await tx.userRole.create({
          data: {
            userId: createdUser.id,
            roleId: role.id,
          },
        });

        return createdUser;
      });

    const otp = this.generateNumericCode();

    const hashedOtp =
      await bcrypt.hash(otp, 10);

    await this.prisma.otpCode.create({
      data: {
        userId: user.id,
        code: hashedOtp,
        type: 'EMAIL_VERIFICATION',
        expiresAt: new Date(
          Date.now() +
            this.OTP_EXPIRY_MINUTES * 60 * 1000,
        ),
      },
    });

    await this.emailService.sendOtpEmail({
      to: email,
      otp,
      subject: 'Verify your email',
    });

    return {
      user: this.toSafeUser(user),
    };
  }

  // =========================
  // Login
  // =========================

  async login(dto: any) {
    const { email, password } = dto;

    if (!email || !password) {
      throw new BadRequestException(
        'Missing credentials',
      );
    }

    const user =
      await this.prisma.user.findFirst({
        where: {
          email,
          deletedAt: null,
        },
      });

    if (!user)
      throw new BadRequestException(
        'Invalid credentials',
      );

    if (user.status === 'SUSPENDED')
      throw new ForbiddenException(
        'Account suspended',
      );

    if (user.status === 'INACTIVE')
      throw new ForbiddenException(
        'Account inactive',
      );

    const isMatch =
      await bcrypt.compare(
        password,
        user.password,
      );

    if (!isMatch)
      throw new BadRequestException(
        'Invalid credentials',
      );

    if (!user.isVerified)
      throw new ForbiddenException(
        'Account not verified',
      );

    const tokens =
      await this.generateTokens(user);

    await this.persistRefreshToken(
      user.id,
      tokens.refreshToken,
    );

    const updatedUser =
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          lastLogin: new Date(),
        },
      });

    return {
      user: this.toSafeUser(updatedUser),
      tokens,
    };
  }

  // =========================
  // Logout
  // =========================

  async logout(refreshToken?: string) {
    if (!refreshToken) return;

    await this.revokeRefreshTokenByValue(
      refreshToken,
    );
  }







// ==========================================
// Refresh Token
// ==========================================

private async verifyAndConsumeRefreshToken(rawToken: string) {
  let decoded: any;

  try {
    decoded = this.jwtService.verify(rawToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  } catch {
    throw new UnauthorizedException('Invalid or expired refresh token');
  }

  const stored = await this.prisma.refreshToken.findUnique({
    where: {
      token: rawToken,
    },
  });

  if (!stored || stored.isRevoked) {
    throw new UnauthorizedException('Refresh token revoked');
  }

  if (new Date() > stored.expiresAt) {
    await this.prisma.refreshToken.update({
      where: {
        id: stored.id,
      },
      data: {
        isRevoked: true,
      },
    });

    throw new UnauthorizedException('Refresh token expired');
  }

  await this.prisma.refreshToken.update({
    where: {
      id: stored.id,
    },
    data: {
      isRevoked: true,
    },
  });

  return decoded;
}

async refreshToken(refreshToken: string) {
  if (!refreshToken) {
    throw new UnauthorizedException(
      'Refresh token is required',
    );
  }

  const decoded =
    await this.verifyAndConsumeRefreshToken(
      refreshToken,
    );

  const user = await this.prisma.user.findFirst({
    where: {
      id: decoded.sub,
      deletedAt: null,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      status: true,
      isVerified: true,
    },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (user.status === 'SUSPENDED') {
    throw new ForbiddenException(
      'Account suspended',
    );
  }

  if (user.status === 'INACTIVE') {
    throw new ForbiddenException(
      'Account inactive',
    );
  }

  const tokens = await this.generateTokens(user);

  await this.persistRefreshToken(
    user.id,
    tokens.refreshToken,
  );

  return {
    user,
    tokens,
  };
}

// ==========================================
// Verify OTP
// ==========================================

async verifyOtp(dto: any) {
  const {
    email,
    otp,
    type = 'EMAIL_VERIFICATION',
  } = dto;

  if (!email || !otp) {
    throw new BadRequestException(
      'Email and OTP are required',
    );
  }

  const user = await this.prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (user.status === 'SUSPENDED') {
    throw new ForbiddenException(
      'Account suspended',
    );
  }

  if (user.status === 'INACTIVE') {
    throw new ForbiddenException(
      'Account inactive',
    );
  }

  if (user.isVerified) {
    throw new BadRequestException(
      'Account already verified',
    );
  }

  const otpRecord =
    await this.findLatestOtp(user.id, type);

  if (!otpRecord) {
    throw new BadRequestException(
      'OTP not found',
    );
  }

  if (new Date() > otpRecord.expiresAt) {
    await this.prisma.otpCode.delete({
      where: {
        id: otpRecord.id,
      },
    });

    throw new BadRequestException(
      'OTP expired',
    );
  }

  const matched = await bcrypt.compare(
    otp,
    otpRecord.code,
  );

  if (!matched) {
    throw new BadRequestException(
      'Invalid OTP',
    );
  }

  await this.prisma.$transaction([
    this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
        status: 'ACTIVE',
      },
    }),

    this.prisma.otpCode.delete({
      where: {
        id: otpRecord.id,
      },
    }),
  ]);

  await this.emailService.sendOtpSuccessEmail({
    to: email,
    subject: 'Verification Successful',
  });
}

// ==========================================
// Resend OTP
// ==========================================

async resendOtp(dto: any) {
  const {
    email,
    type = 'EMAIL_VERIFICATION',
  } = dto;

  if (!email) {
    throw new BadRequestException(
      'Email is required',
    );
  }

  const user = await this.prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (user.isVerified) {
    throw new BadRequestException(
      'Account already verified',
    );
  }

  await this.invalidatePreviousOtps(
    user.id,
    type,
  );

  const otp = this.generateNumericCode();

  const hashedOtp = await bcrypt.hash(
    otp,
    10,
  );

  await this.prisma.otpCode.create({
    data: {
      userId: user.id,
      code: hashedOtp,
      type,
      expiresAt: new Date(
        Date.now() +
          this.OTP_EXPIRY_MINUTES * 60 * 1000,
      ),
    },
  });

  await this.emailService.sendOtpEmail({
    to: email,
    otp,
    subject: 'New OTP Verification Code',
  });
}


// ==========================================
// Forget Password
// ==========================================

async forgetPassword(dto: ForgetPasswordDto) {
  const { email } = dto;

  if (!email) {
    throw new BadRequestException('Email is required');
  }

  const user = await this.prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (!user.isVerified) {
    throw new ForbiddenException(
      'Account is not verified',
    );
  }

  await this.invalidatePreviousOtps(
    user.id,
    'RESET_PASSWORD',
  );

  const resetToken = this.generateResetToken();

  const hashedToken = await bcrypt.hash(
    resetToken,
    10,
  );

  await this.prisma.otpCode.create({
    data: {
      userId: user.id,
      code: hashedToken,
      type: 'RESET_PASSWORD',
      expiresAt: new Date(
        Date.now() +
          this.RESET_PASSWORD_EXPIRY_MINUTES *
            60 *
            1000,
      ),
    },
  });

  const resetLink =
    `${this.configService.get<string>('FRONTEND_URL')}` +
    `/reset-password/${user.id}/${resetToken}`;

  await this.emailService.sendResetPasswordEmail(
    email,
    resetLink,
  );

  return {
    resetLink,
  };
}

// ==========================================
// Reset Password
// ==========================================

async resetPassword(dto: ResetPasswordDto) {
  const {
    userId,
    resetToken,
    newPassword,
  } = dto;

  if (
    !userId ||
    !resetToken ||
    !newPassword
  ) {
    throw new BadRequestException(
      'Missing required fields',
    );
  }

  const user = await this.prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
    },
  });

  if (!user) {
    throw new NotFoundException(
      'User not found',
    );
  }

  const otpRecord =
    await this.findLatestOtp(
      user.id,
      'RESET_PASSWORD',
    );

  if (!otpRecord) {
    throw new BadRequestException(
      'Reset token not found',
    );
  }

  if (new Date() > otpRecord.expiresAt) {
    await this.prisma.otpCode.delete({
      where: {
        id: otpRecord.id,
      },
    });

    throw new BadRequestException(
      'Reset token expired',
    );
  }

  const matched =
    await bcrypt.compare(
      resetToken,
      otpRecord.code,
    );

  if (!matched) {
    throw new BadRequestException(
      'Invalid reset token',
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      newPassword,
      10,
    );

  await this.prisma.$transaction([
    this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    }),

    this.prisma.otpCode.delete({
      where: {
        id: otpRecord.id,
      },
    }),

    this.prisma.refreshToken.updateMany({
      where: {
        userId: user.id,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
      },
    }),
  ]);
}

// ==========================================
// Find All Users
// ==========================================

async findUsers() {
  const users =
    await this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
    });

  if (!users.length) {
    throw new NotFoundException(
      'No users found',
    );
  }

  return users.map((user) =>
    this.toSafeUser(user),
  );
}


}
