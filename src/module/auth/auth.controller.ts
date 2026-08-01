import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { setAuthCookies, clearAuthCookies } from '../../utils/setAuthCookies';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(dto);

    return {
      success: true,
      message: 'Register successfully',
      user: result.user,
      otpToken: result.otpToken,
    };
  }

  // Login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.login(dto);

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return {
      success: true,
      user,
      tokens,
    };
  }

  // Logout
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.RefreshToken;

    await this.authService.logout(refreshToken);

    clearAuthCookies(res);

    return {
      success: true,
      message: 'Logout successfully',
    };
  }

  // Refresh Token
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: Request,
    @Body() body: { refreshToken?: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const token =
      req.cookies?.RefreshToken ||
      body.refreshToken ||
      req.headers['x-refresh-token'];

    const { user, tokens } = await this.authService.refreshToken(
      token as string,
    );

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return {
      success: true,
      message: 'Token refreshed successfully',
      user,
      tokens,
    };
  }

  // Verify OTP
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    await this.authService.verifyOtp(dto);

    return {
      success: true,
      message: 'OTP verified successfully',
    };
  }

  // Resend OTP
  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOtp(@Body() dto: ResendOtpDto) {
    const result = await this.authService.resendOtp(dto);

    return {
      success: true,
      message: 'OTP sent successfully',
      otpToken: result.otpToken,
    };
  }

  // Forget Password
  @Post('forget-password')
  @HttpCode(HttpStatus.OK)
  async forgetPassword(@Body() dto: ForgetPasswordDto) {
    await this.authService.forgetPassword(dto);

    return {
      success: true,
      message: 'Reset password link sent',
    };
  }

  // Reset Password
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto);

    return {
      success: true,
      message: 'Password reset successfully',
    };
  }

  // Get All Users
  @UseGuards(JwtAuthGuard)
  @Get('found-user')
  async findUsers() {
    return this.authService.findUsers();
  }

  // Delete Account
  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  @HttpCode(HttpStatus.OK)
  async deleteAccount(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.deleteAccount(req.user.id);

    clearAuthCookies(res);

    return {
      success: true,
      message: 'Account deleted successfully',
    };
  }

  // Google OAuth
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Passport بيتولى تحويل المستخدم لصفحة Google تلقائيًا
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.loginWithGoogle(
      req.user as any,
    );

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return {
      success: true,
      user,
      tokens,
    };
  }
}
