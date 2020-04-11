import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomDto} from './room.entity'
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






}
