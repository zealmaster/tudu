import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-guard.guard';
import { LoginUserDto } from './userLogin.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() body: LoginUserDto, @Req() req) {
    if (req.user.success === false) {
      return req.user;
    }
    return await this.authService.loginUser(body.username);
  }

  @Get('csrf')
  async getCsrfToken(@Req() req: Request) {
    return {'csrf-token': req.csrfToken()};
  }
}
