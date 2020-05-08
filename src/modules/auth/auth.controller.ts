import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthDto} from './auth.entity'
<<<<<<< Updated upstream
import { ApiTags, ApiExcludeEndpoint, ApiResponse } from '@nestjs/swagger';
import { messages } from 'src/utils/messages';
=======
import { ApiTags, ApiExcludeEndpoint, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../utils/auth.guard';
import { UserId } from '../../utils/user.decorator';
import { messages } from '../../utils/messages';
>>>>>>> Stashed changes
@ApiTags('auth')
@Controller('auth')
@ApiResponse({status:'default', description:messages.basicError})
export class AuthController {
    constructor(private readonly authService: AuthService) {}


    @Post('/login/experimental/v1')
    async loginUserExp(@Body() body:AuthDto) {
      return await this.authService.loginUserExp(body);
    }
    @Post('/login/experimental/v2')
    async loginUserExp2(@Body() body:AuthDto) {
      return await this.authService.loginUserExp(body,true);
    }
    @ApiExcludeEndpoint()
    @Post('/login')
    loginUser(@Body() body:AuthDto) {
      return this.authService.loginUser();
    }
    @ApiExcludeEndpoint()
    @Get()
    health() {
      return 'ok'
    }


}
