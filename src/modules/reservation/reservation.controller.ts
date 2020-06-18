import { Controller, Post, Body, Get, Param, UseGuards, Delete, Put } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationDto}  from './reservation.entity';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { messages } from '../../utils/messages';
import { AuthGuard } from '../../utils/auth.guard';
import { PostReservationDto } from './dto/post.reservation.dto';
import { UserId , UserDec} from '../../utils/user.decorator';
import { User } from '../user/user.entity';

@ApiTags('reservation')
@Controller('reservation')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiResponse({status:'default', description:messages.basicError})
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}


    @Get()
    @ApiResponse({status:200,type:[ReservationDto], description:'Returns array of future reservations'})
    async getAll(@UserDec() user:User){
      return await this.reservationService.getReservationByUserId(user.userCode)
    }
    @Get(':id')
    @ApiResponse({status:200,type:ReservationDto, description:'Returns one reservation'})
    async getOneById(@Param('id') id){
      return await this.reservationService.getOneById(id)
    }

    @Get('/secondary')
    @ApiResponse({status:200,type:[ReservationDto], description:'Returns array of future reservations as secondaryUser'})
    async getSecondary(@UserDec() user:User){
      return await this.reservationService.getReservationByUserIdSecondary(user.userCode)
    }

    @Get('/active')
    @ApiResponse({status:200,type:[ReservationDto], description:'Returns an active reservation'})
    async getActive(@UserDec() user:User){
      return await this.reservationService.getActivated(user.userCode)
    }

    @Post()
    @ApiResponse({status:201,type:ReservationDto, description:'Makes reservations for 1 user'})
    async reserve(@Body() body: PostReservationDto,@UserDec() user){
      return await this.reservationService.reserve(body,user)
    }

    @Put(':id')
    @ApiParam({name:'id', example:'5e99dc2766e67109b80e4257'})
    @ApiResponse({status:201,type:ReservationDto, description:'Activates reservation if inside the hour'})
    async activate(@Param('id') id,@UserDec() user){
      return await this.reservationService.activateReservation(id,user)
    }

    @Delete(':id')
    @ApiParam({name:'id', example:'5e99dc2766e67109b80e4257'})
    @ApiResponse({status:201,type:ReservationDto, description:'Deletes the reservation if it is before it starts && is not active'})
    async cancel(@Param('id') reservationId: string,@UserDec() user){
      return await this.reservationService.cancelReservation(reservationId,user)
    }

}
