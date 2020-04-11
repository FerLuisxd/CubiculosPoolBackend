import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationDto}  from './reservation.entity';
@Controller('reservation')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}


    @Get()
    async getAll(){
      return await this.reservationService.getAll()
    }
    @Get(':id')
    async getOneById(@Param('id') id){
      return await this.reservationService.getOneById(id)
    }



}
