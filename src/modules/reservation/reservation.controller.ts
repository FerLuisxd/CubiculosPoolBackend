import { Controller, Post, Body } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationDto}  from './reservation.entity';
@Controller('reservation')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}


    @Post('/login/exp')
    async loginUserExp(@Body() body:ReservationDto) {
      return await this.reservationService.loginUserExp(body);
    }



}
