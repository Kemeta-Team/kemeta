import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';


// import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
    };
  }

  // Login
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.login(dto);

    this.authService.setAuthCookies(
      res,
      tokens.accessToken,
      tokens.refreshToken,
    );

    return {
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

    this.authService.clearAuthCookies(res);

    return {
      message: 'Logout successfully',
    };
  }

  // Refresh Token
  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token =
      req.cookies?.RefreshToken ||
      body.refreshToken ||
      req.headers['x-refresh-token'];

    const { user, tokens } = await this.authService.refreshToken(
      token as string,
    );

    this.authService.setAuthCookies(
      res,
      tokens.accessToken,
      tokens.refreshToken,
    );

    return {
      success: true,
      message: 'Token refreshed successfully',
      user,
      tokens,
    };
  }

  // Verify OTP
  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    await this.authService.verifyOtp(dto);

    return {
      message: 'OTP verified successfully',
    };
  }

  // Resend OTP
  @Post('resend-otp')
  async resendOtp(@Body() dto: ResendOtpDto) {
    await this.authService.resendOtp(dto);

    return {
      message: 'OTP sent successfully',
    };
  }

  // Forget Password
  @Post('forget-password')
  async forgetPassword(@Body() dto: ForgetPasswordDto) {
    await this.authService.forgetPassword(dto);

    return {
      message: 'Reset password link sent',
    };
  }

  // Reset Password
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto);

    return {
      message: 'Password reset successfully',
    };
  }

  // Get All Users
  @UseGuards(JwtAuthGuard)
  @Get('found-user')
  async findUsers() {
    return this.authService.findUsers();
  }

  // Deactivate Account
  @UseGuards(JwtAuthGuard)
  @Patch('deactivate')
  async deactivateAccount(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.deactivateAccount(req.user.id);

    this.authService.clearAuthCookies(res);

    return {
      message: 'Account deactivated successfully',
    };
  }

  // Reactivate Account
  @Patch('reactivate')
  async reactivateAccount(@Body() dto: ReactivateAccountDto) {
    await this.authService.reactivateAccount(dto.email);

    return {
      message: 'Account reactivated successfully',
    };
  }

  // Delete Account
  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteAccount(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.deleteAccount(req.user.id);

    this.authService.clearAuthCookies(res);

    return {
      message: 'Account deleted successfully',
    };
  }

  // Google Callback

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    // هنا ترجع JWT أو تسجل دخول في النظام
    return req.user;
  }
}
