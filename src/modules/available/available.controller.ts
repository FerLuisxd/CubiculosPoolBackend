import { Controller, Post, Body, Get, Param, UseGuards, Query } from '@nestjs/common';
import { AvailableService } from './available.service';
import { AvailableDto}  from './available.entity';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { messages } from 'src/utils/messages';
import { AuthGuard } from 'src/utils/auth.guard';

@ApiTags('available')
@Controller('available')
// @UseGuards(AuthGuard)
@ApiResponse({status:'default', description:messages.basicError})
export class AvailableController {
    constructor(private readonly availableService: AvailableService) {}


    @Get()
    @ApiResponse({status:200,type:[AvailableDto], description:'Returns one available'})
    @ApiQuery({type:String,example:'I707',name:'code'})
    @ApiQuery({type:String,example:'MO',name:'office'})
    @ApiQuery({type:Number,example:2,name:'hours'  })
    @ApiQuery({type:String,example:'2020-07-17 08:00:00.000',name:'start',description:'Local Hour'})
    @ApiResponse({status:200,type:[AvailableDto], description:'Returns array of availables'})
    async getAll(@Query('code') code,@Query('office') office,
    @Query('hours') hours,@Query('start') start){
      const object = {
        start,
        code,
        office,
        hours: hours || 1
      }
      return await this.availableService.getOneRoom(object)
    }
    // @Get('/')
    // async getOneById(@Query('code') code,@Query('office') office,
    // @Query('hours') hours,@Query('start') start){
    //   const object = {
    //     start,
    //     code,
    //     office,
    //     hours: hours || 1
    //   }
    //   return await this.availableService.getOneRoom(object)
    // }



}
