import { Injectable, BadRequestException, Inject, HttpException } from '@nestjs/common';
import { Browser, Page, launch } from 'puppeteer';
import { ReservationDto } from './reservation.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { Pool } from 'lightning-pool';
import { puppetterLogin } from '../../utils/puppetter';
import { JWTsign } from '../../utils/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AvailableService } from '../available/available.service';
import { PostReservationDto } from './dto/post.reservation.dto';
import * as moment from 'moment-timezone'
/* eslint-disable prefer-const*/

@Injectable()
export class ReservationService {

    constructor(@InjectModel('reservations') private reservationModel: Model<any>,private readonly availableService:AvailableService, private readonly userService: UserService) {
    }

    async getAll(){
        return this.reservationModel.find({})
    }
    async getActiveByUserId(userCode:string){
        console.log('userCode',userCode)
        return this.reservationModel.find({userCode:userCode})
    }
    async getOneById(id){
        return this.reservationModel.findOne({_id:id})
    }

    async getFree(){
        return this.reservationModel.find({})
    }
    async saveNew(reservation: ReservationDto) {
        const reservationSave = new this.reservationModel(reservation)
        return await reservationSave.save()
    }
    async Reserve(body:PostReservationDto,userId: string){
        let rooms = await this.availableService.getAvailableRooms({
            code: body.room.code,
            start: body.start,
            office: body.room.office,
            hours: body.hours
        })
        console.log(rooms.length)
        if(rooms.length!=body.hours) new HttpException('Not enough available rooms',400)
        let user = await this.userService.findOne(userId)
        let userSecondary = await this.userService.findOneUserCode(body.userSecondaryCode)
        if(!userSecondary) new HttpException('Secondary User does not exist',400)
        console.log(moment(body.start).date(), moment().date())
        if(moment(body.start).date() == moment().date()){
            if(user.hoursLeft.todayHours < body.hours) new HttpException('Not enough Hours',409)
            //QUITAR HORAS
            this.userService.updateReduceHours(user._id,user.hoursLeft.todayHours-body.hours)
        }
        else if(moment(body.start).date() == moment().date()+1){
            if(user.hoursLeft.tomorrowHours < body.hours) new HttpException('Not enough Hours',409)
            //QUITAR HORAS DE MANIANA
            this.userService.updateReduceHours(user._id,user.hoursLeft.tomorrowHours-body.hours,true)
        }
        // QUITAR DE DISPONIBLE
        this.availableService.deleteRooms(body)
        // Reservar
        let bodyToSave = new ReservationDto()

        bodyToSave.active = false
        bodyToSave.start = moment(body.start).utc();
        bodyToSave.end = moment(body.start).add(body.hours,'hours').utc();
        bodyToSave.room = {
            seats : rooms[0].available[0].seats,
            office : rooms[0].available[0].office,
            code : rooms[0].available[0].code,
            features : rooms[0].available[0].features
        }
        bodyToSave.seats = []
        bodyToSave.userCode = user.userCode
        bodyToSave.userSecondaryCode = body.userSecondaryCode
        console.log('bodyToSave',bodyToSave)
        return await this.saveNew(bodyToSave)
        // console.log(rooms)
        // return rooms
    }
}
