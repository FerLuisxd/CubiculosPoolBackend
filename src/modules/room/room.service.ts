import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Browser, Page, launch } from 'puppeteer';
import { RoomDto } from './room.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { Pool } from 'lightning-pool';
import { puppetterLogin } from '../../utils/puppetter';
import { JWTsign } from '../../utils/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Room } from '../reservation/reservation.entity';
// const puppeteer = require('puppeteer');
/* eslint-disable prefer-const*/

@Injectable()
export class RoomService {

    constructor(@InjectModel('rooms') private roomModel: Model<any>) {

    }
    async saveRoom(room: RoomDto){    
        try{
            const createdRoom= new this.roomModel(room)
            return await createdRoom.save()
        }catch(error){
            throw new InternalServerErrorException(error.message)
        }
    }

    async getAll(){
        return this.roomModel.find({})
    }
    async getFree(){
        return this.roomModel.find({busy:false})
    }
    async getOneById(id){
        return this.roomModel.findOne({_id:id})
    }
    async getFeatures(id){

        return this.roomModel.find({_id:id},'features')
    }


}
