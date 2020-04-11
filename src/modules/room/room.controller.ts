import { Controller, Post, Body } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomDto} from './room.entity'
@Controller('room')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}


    @Post('/login/exp')
    async loginUserExp(@Body() body:RoomDto) {
      return await this.roomService.loginUserExp(body);
    }

    @Post('/login')
    loginUser() {
      return this.roomService.loginUser();
    }


}
