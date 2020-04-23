import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { AvailableService } from './available.service';
import { AvailableDto}  from './available.entity';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { messages } from 'src/utils/messages';
import { AuthGuard } from 'src/utils/auth.guard';

@ApiTags('available')
@Controller('available')
// @UseGuards(AuthGuard)
@ApiResponse({status:'default', description:messages.basicError})
export class AvailableController {
    constructor(private readonly availableService: AvailableService) {}


    @Get()
    @ApiResponse({status:200,type:[AvailableDto], description:'Returns array of availables'})
    async getAll(){
      return await this.availableService.getAll()
    }
    @Get(':id')
    @ApiResponse({status:200,type:AvailableDto, description:'Returns one available'})
    async getOneById(@Param('id') id){
      return await this.availableService.getOneById(id)
    }

    @Get('/available')
    @ApiResponse({status:200,type:AvailableDto, description:'Returns array of available to reserve rooms'})
    async getFree(){
      return await this.availableService.getFree()
    }

}
