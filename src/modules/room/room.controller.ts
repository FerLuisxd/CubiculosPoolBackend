import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomDto} from './room.entity'

import { ApiTags, ApiExcludeEndpoint, ApiParam, ApiResponse } from '@nestjs/swagger';
import { messages } from 'src/utils/messages';
@ApiTags('room')
@Controller('room')
@ApiResponse({status:'default', description:messages.basicError})
export class RoomController {
    constructor(private readonly roomService: RoomService) {}
    
    @Get()
    @ApiExcludeEndpoint()
    async getAll(){
      return await this.roomService.getAll()
    }
    @Get(':id')
    @ApiParam({name:'id',type:'string',example:'5e99dc2766e67109b80e4257', description:'Room Id'})
    @ApiResponse({status:200,type:RoomDto, description:'Returns one room'})
    async getOneById(@Param('id') id){
      return await this.roomService.getOneById(id)
    }
    @ApiExcludeEndpoint()
    @Post()
    async newRoom(@Body() room:RoomDto){
      return await this.roomService.saveRoom(room);
    }
    @Get('/available')
    @ApiResponse({status:200,type:[RoomDto], description:'Returns array of available to reserve rooms'})
    async getFree(){
      return await this.roomService.getFree()
    }
    // @ApiExcludeEndpoint()
    @Get(':id/features')
    @ApiResponse({status:200,type:String,isArray:true, description:'Returns array of resources of one room'})
    async getFeaturesById(@Param('id') id){
      return await this.roomService.getFeatures(id);
    }






}
