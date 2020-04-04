import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    loginUser() {
      return this.authService.loginUser();
    }

}
