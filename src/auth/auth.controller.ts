import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

// Extend Express Request interface to include user property
interface RequestWithUser extends Request {
  user: any;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: RequestWithUser) {
    // Guard will handle the authentication
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: RequestWithUser, @Res() res: Response) {
    const user = req.user;
    const result = await this.authService.login(user);
    
    // Check if frontend URL is configured, otherwise redirect to backend success page
    const frontendUrl = process.env.FRONTEND_URL;
    if (frontendUrl) {
      const redirectUrl = `${frontendUrl}/auth/callback?token=${result.access_token}`;
      res.redirect(redirectUrl);
    } else {
      // Redirect to backend success page with token
      const redirectUrl = `http://localhost:3000/auth/success?token=${result.access_token}`;
      res.redirect(redirectUrl);
    }
  }

  @Get('success')
  getSuccess(@Req() req: Request) {
    const token = req.query.token as string;
    return {
      message: 'Authentication successful!',
      token: token,
      user: 'User data available with this token',
      instructions: 'Use this token in Authorization header: Bearer ' + token
    };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }
} 