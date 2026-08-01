import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../../../prisma/prisma.module';

import { GoogleStrategy } from './strategies/google.strategy';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule,

    PrismaModule,
    PassportModule.register({
      session: false,
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const accessSecret = config.get<string>('JWT_ACCESS_SECRET');
        const expiresIn = config.get<string>('JWT_ACCESS_EXPIRES') || '15m';

        if (!accessSecret) {
          throw new Error(
            'JWT_ACCESS_SECRET is not defined in environment variables',
          );
        }

        return {
          secret: accessSecret,
          signOptions: {
            expiresIn: isNaN(Number(expiresIn))
              ? expiresIn
              : (Number(expiresIn) as any),
          },
        };
      },
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService, GoogleStrategy, JwtAuthGuard],

  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
