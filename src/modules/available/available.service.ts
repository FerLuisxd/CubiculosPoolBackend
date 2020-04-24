import { Injectable, BadRequestException } from '@nestjs/common';
import { Browser, Page, launch } from 'puppeteer';
import { AvailableDto } from './available.entity'
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { Pool } from 'lightning-pool';
import { puppetterLogin } from '../../utils/puppetter';
import { JWTsign } from '../../utils/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment-timezone'
/* eslint-disable prefer-const*/
@Injectable()
export class AvailableService {

    constructor(@InjectModel('availables') private availableModel: Model<any>) {
    }

    async getAll(){
        return this.availableModel.find({})
    }
    async getOneById(id){
        return this.availableModel.findOne({_id:id})
    }
    async deleteRooms(obj){
        const query:any = {}
        if(obj.start) {
            query.start = moment(obj.start).tz("America/Lima").toISOString()
        }
        if(obj.code) {
            query["available.code"] = obj.code
        }
        if(obj.office){
            query["available.office"] = obj.office
        }
        if(obj?.hours > 1 && obj.start){
            query.start = {
                "$in": []
            }
            for (let i = 0; i < obj.hours; i++) {
                query.start["$in"].push(moment(obj.start).tz("America/Lima").add(i,'hours').toISOString())
            }
        }
        await this.availableModel.deleteMany(query)
    }


    async getAvailableRooms(obj){
        const query:any = {}
        let projetion = {}
        if(obj.start) {
            query.start = moment(obj.start).tz("America/Lima").toISOString()
        }
        if(obj.code) {
            query["available.code"] = obj.code
        }
        if(obj.office){
            query["available.office"] = obj.office
        }
        if(obj?.hours > 1 && obj.start){
            query.start = {
                "$in": []
            }
            for (let i = 0; i < obj.hours; i++) {
                query.start["$in"].push(moment(obj.start).tz("America/Lima").add(i,'hours').toISOString())
            }
        }
        if(obj.hours && obj.start){
            projetion = {"start":1,"available.$":1}
        }
        console.log(query)
        let response =  await this.availableModel.find(query,projetion)
        response = JSON.parse(JSON.stringify(response))
        for (let i = 0; i < response.length; i++) {
            response[i].start = moment(response[i].start).tz("America/Lima").format()
        }
        return response
    }
}
