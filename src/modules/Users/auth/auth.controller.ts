import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/login
  // Body: { "emailGoogle": "...", "senha": "..." }
  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body.emailGoogle, body.senha);
  }
}
