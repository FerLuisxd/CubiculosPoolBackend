import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationDto}  from './reservation.entity';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { messages } from 'src/utils/messages';
import { AuthGuard } from 'src/utils/auth.guard';
import { PostReservationDto } from './dto/post.reservation.dto';
import { UserId , UserCode } from 'src/utils/user.decorator';

@ApiTags('reservation')
@Controller('reservation')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiResponse({status:'default', description:messages.basicError})
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}


    @Get()
    @ApiResponse({status:200,type:[ReservationDto], description:'Returns array of reservations'})
    async getAll(@UserCode() user:string){
      return await this.reservationService.getActiveByUserId(user)
    }
    @Get(':id')
    @ApiResponse({status:200,type:ReservationDto, description:'Returns one reservation'})
    async getOneById(@Param('id') id){
      return await this.reservationService.getOneById(id)
    }

    @Post()
    @ApiResponse({status:201,type:ReservationDto, description:'Makes reservations for 1 user'})
    async Reserve(@Body() body: PostReservationDto,@UserId() id){
      return await this.reservationService.Reserve(body,id)
    }

}
