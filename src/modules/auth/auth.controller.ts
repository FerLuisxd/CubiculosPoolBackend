import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}


    @Post('/login/exp')
    async loginUserExp(@Body() body) {
      return await this.authService.loginUserExp(body);
    }

    @Post('/login')
    loginUser() {
      return this.authService.loginUser();
    }


}
