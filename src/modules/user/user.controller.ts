import { Controller, Post, Body, Get, Res, HttpStatus, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('/see')
  async getUser(){
    return this.userService.getAll()
  }

  @Post('/create')
  async newUser(@Body() user:User) {
    return await this.userService.saveNew(user);
  }

  @Get('/:id')
  async getUserById(@Param('id') id){
    return this.userService.getOneById(id)
  }
}


