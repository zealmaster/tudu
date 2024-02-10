import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-guard.guard';
import { LoginUserDto } from './userLogin.dto';

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
}
