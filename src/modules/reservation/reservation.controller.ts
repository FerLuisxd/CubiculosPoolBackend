import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationDto}  from './reservation.entity';
<<<<<<< Updated upstream
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { messages } from 'src/utils/messages';
=======
import { ApiTags, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { messages } from '../../utils/messages';
import { AuthGuard } from '../../utils/auth.guard';
import { PostReservationDto } from './dto/post.reservation.dto';
import { UserId , UserDec} from '../../utils/user.decorator';
import { User } from '../user/user.entity';
>>>>>>> Stashed changes

@ApiTags('reservation')
@Controller('reservation')
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



}
