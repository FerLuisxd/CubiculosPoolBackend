import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment-timezone'
/* eslint-disable prefer-const*/
@Injectable()
export class AvailableService {

    constructor(@InjectModel('availables') private availableModel: Model<any>) {
    }

    async getAll() {
        return this.availableModel.find({})
    }
    async getOneById(id) {
        return this.availableModel.findOne({ _id: id })
    }
    async deleteRooms(obj) {
        const query: any = {}
        console.time('aaaa')
        const updateQuery :any = {}
        if (obj.start) {
            query.start = moment(obj.start).tz("America/Lima").toISOString()
        }
        if (obj?.hours > 1 && obj.start) {
            query.start = {
                "$in": []
            }
            for (let i = 0; i < obj.hours; i++) {
                query.start["$in"].push(moment(obj.start).tz("America/Lima").add(i, 'hours').toISOString())
            }
        }

        let updateQuery2=   { $pull: { available:  {code:obj.room.code, office: obj.room.office  } } }
        await this.availableModel.updateMany(query, updateQuery2)
        console.timeEnd('aaaa')
    }


    async getAvailableRooms(obj) {
        const query: any = {}
        let projetion = {}
        if (obj.start) {
            query.start = moment(obj.start).tz("America/Lima").toISOString()
        }
        if (obj.code) {
            if (!query.available) {
            query.available = {
                $elemMatch: {}
            }
            }
            query.available.$elemMatch.code = obj.code
        }
        if (obj.office) {
            if (!query.available) {
            query.available = {
                $elemMatch: {}
            }
            }
            query.available.$elemMatch.office = obj.office
        }
        if (obj?.hours > 1 && obj.start) {
            query.start = {
                "$in": []
            }
            for (let i = 0; i < obj.hours; i++) {
                query.start["$in"].push(moment(obj.start).tz("America/Lima").add(i, 'hours').toISOString())
            }
        }
        if (obj.hours && obj.start) {
            projetion = { "start": 1 , "available":1}
            if(obj.code || obj.office) 
            projetion = { "start": 1, "available.$": 1 }
        }
        let response = await this.availableModel.find(query, projetion)
        response = JSON.parse(JSON.stringify(response))
        for (let i = 0; i < response.length; i++) {
            response[i].start = moment(response[i].start).tz("America/Lima").format()
        }
        return response
    }
}
