import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RoomDto } from './room.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
;
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
        return this.roomModel.find({},{
            "_id":0, "__v":0,"floor":0, "building":0
            })
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
