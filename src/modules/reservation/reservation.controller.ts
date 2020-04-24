import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationDto}  from './reservation.entity';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { messages } from 'src/utils/messages';
import { AuthGuard } from 'src/utils/auth.guard';

@ApiTags('reservation')
@Controller('reservation')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiResponse({status:'default', description:messages.basicError})
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}


    @Get()
    @ApiResponse({status:200,type:[ReservationDto], description:'Returns array of reservations'})
    async getAll(){
      return await this.reservationService.getAll()
    }
    @Get(':id')
    @ApiResponse({status:200,type:ReservationDto, description:'Returns one reservation'})
    async getOneById(@Param('id') id){
      return await this.reservationService.getOneById(id)
    }

    @Get('/available')
    @ApiResponse({status:200,type:ReservationDto, description:'Returns array of available to reserve rooms'})
    async getFree(){
      return await this.reservationService.getFree()
    }

    @Post()
    @ApiResponse({status:201,type:ReservationDto, description:'Makes reservations for 1 user'})
    async Reserve(@Body() body){
      return await this.reservationService.Reserve(body)
    }

}
