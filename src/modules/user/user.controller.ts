import { Controller, Post, Body, Get, Res, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ApiTags, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GetUserDto } from './dto/getUser.dto';
import { messages } from '../../utils/messages';
import { AuthGuard } from '../../utils/auth.guard';
import { UserId } from '../../utils/user.decorator';

@ApiTags('user')
@Controller('user')
// @ApiBearerAuth()
@ApiResponse({status:'default', description:messages.basicError})
export class UserController {
  constructor(private readonly userService: UserService) { }
  
  // @Get()
  // @ApiResponse({status:200,type:[User], description:'Returns array of Users'})
  // async getUser(){
  //   return this.userService.getAll()
  // }
  
  @Get('/:id')
  @ApiParam({name:'id',type:'string',example:'5e99dc2766e67109b80e4257', description:'User Id'})
  @ApiResponse({status:200,type:User, description:'Returns one User'})
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getUserById(@Param('id') id,@UserId() idUser){
    return this.userService.findOne(id||idUser)
  }
} 


