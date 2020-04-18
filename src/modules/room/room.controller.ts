import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomDto} from './room.entity'
import { Room } from '../reservation/reservation.entity';
import { async } from 'rxjs/internal/scheduler/async';
@Controller('room')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}
    
    @Get()
    async getAll(){
      return await this.roomService.getAll()
    }
    @Get(':id')
    async getOneById(@Param('id') id){
      return await this.roomService.getOneById(id)
    }
    @Post('/create')
    async newRoom(@Body() room:RoomDto){
      return await this.roomService.saveRoom(room);
    }
    @Get('/getFree')
    async getFree(){
      return await this.roomService.getFree()
    }






}
