import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthDto} from './auth.entity'
import { ApiTags, ApiExcludeEndpoint, ApiResponse } from '@nestjs/swagger';
import { messages } from 'src/utils/messages';
@ApiTags('auth')
@Controller('auth')
@ApiResponse({status:'default', description:messages.basicError})
export class AuthController {
    constructor(private readonly authService: AuthService) {}


    @Post('v2/login')
    async loginUserExp(@Body() body:AuthDto) {
      return await this.authService.loginUserExp(body);
    }
    @Post('v3/login')
    async loginUserExp2(@Body() body:AuthDto) {
      return await this.authService.loginUserExp(body,true);
    }
    @ApiExcludeEndpoint()
    @Post('v1/login')
    loginUser(@Body() body:AuthDto) {
      return this.authService.loginUser();
    }
    @ApiExcludeEndpoint()
    @Get()
    health() {
      return 'ok'
    }


}
