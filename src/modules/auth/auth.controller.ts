import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthDto} from './auth.entity'
import { ApiTags, ApiExcludeEndpoint, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { messages } from 'src/utils/messages';
import { AuthGuard } from 'src/utils/auth.guard';
import { UserId } from 'src/utils/user.decorator';
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
    @Get('/logouts')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async logout(@UserId() id) {
      return await this.authService.logout(id);
    }
    @ApiExcludeEndpoint()
    @Get()
    health() {
      return 'ok'
    }


}
