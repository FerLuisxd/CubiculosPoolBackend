import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthDto} from './auth.entity'
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}


    @Post('/login/exp')
    async loginUserExp(@Body() body:AuthDto) {
      return await this.authService.loginUserExp(body);
    }

    @Post('/login')
    loginUser() {
      return this.authService.loginUser();
    }


}
