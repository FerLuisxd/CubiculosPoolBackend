import { Injectable, HttpException } from '@nestjs/common';
import { ReservationDto } from './reservation.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AvailableService } from '../available/available.service';
import { PostReservationDto } from './dto/post.reservation.dto';
import * as moment from 'moment-timezone'
import { PutPublicReservationDto } from './dto/put.public-reservation.dto';
import { PostJoinPublicDto } from './dto/post.public-reservation.dto';
/* eslint-disable prefer-const*/
moment.locale('es');

@Injectable()
export class ReservationService {

    constructor(@InjectModel('reservations') private reservationModel: Model<any>, private readonly availableService: AvailableService, private readonly userService: UserService) {
    }

    async getAll() {
        return this.reservationModel.find({})
    }
    async getReservationByUserId(userCode: string) {
        let currentDate = moment().tz("America/Lima").set({ minute: 0, second: 0, millisecond: 0 })
        let query = {
            $or: [ { userCode: userCode }, { userSecondaryCode: userCode } ],
            start: {
                $gte: currentDate.toISOString(),
                $lte: currentDate.add(24, 'hours').toISOString()
            }
        }
        let response = await this.reservationModel.find(query)
        response = JSON.parse(JSON.stringify(response))
        for (let i = 0; i < response.length; i++) {
        // console.log('query',query)
            response[i].startParsed = moment(response[i].start).tz("America/Lima").format('dddd, hA')
            response[i].endParsed = moment(response[i].end).tz("America/Lima").format('dddd, hA')
        }
        // console.log('getAvailableRooms', response)
        return response
    }
    async getAllPublic() {
        let currentDate = moment().tz("America/Lima").set({ minute: 0, second: 0, millisecond: 0 })
        let query = {
            start: {
                $gte: currentDate.toISOString()
            },
            public: true
        }
        let response = await this.reservationModel.find(query)
        response = JSON.parse(JSON.stringify(response))
        for (let i = 0; i < response.length; i++) {
        // console.log('query',query)
        response[i].startParsed = moment(response[i].start).tz("America/Lima").format('dddd, hA')
        response[i].endParsed = moment(response[i].end).tz("America/Lima").format('dddd, hA')
        }
        // console.log('getAvailableRooms', response)
        return response
    }
    async getReservationByUserIdSecondary(userCode: string) {
        let currentDate = moment().tz("America/Lima").set({ minute: 0, second: 0, millisecond: 0 })
        let query = {//
            userSecondaryCode: userCode,
            start: {
                $gte: currentDate.toISOString(),
                $lte: currentDate.add(24, 'hours').toISOString()
            }
        }
        return this.reservationModel.find(query)
    }

    async getActivated(userCode: string) {
        let query = {
            userCode: userCode,
            active: true
        }
        let response= await this.reservationModel.findOne(query)
        response = JSON.parse(JSON.stringify(response))
        for (let i = 0; i < response.length; i++) {
        // console.log('query',query)
        response[i].startParsed = moment(response[i].start).tz("America/Lima").format('dddd, hA')
        response[i].endParsed = moment(response[i].end).tz("America/Lima").format('dddd, hA')
        }
        // console.log('getAvailableRooms', response)
        return response
        
    }

    async activateReservation(id, user: User) {
        if (user.inRoom == false) {
            let currentDate = moment().tz("America/Lima").set({ minute: 0, second: 0, millisecond: 0 })
            let query = {
                _id: id,
                start: {
                    $gte: currentDate.toISOString(),
                    $lte: currentDate.add(1, 'hours').toISOString()
                },
                active: false,
                "seats.0": { "$exists": false }
            }
            let updateQuery: any = {
                $push: {
                    seats: {
                        userCode: user.userCode,
                        name: user.name
                    }
                }
            }
            let response = await this.reservationModel.findOneAndUpdate(query, updateQuery)
            console.log('response', response)
            if (response != null) {
                this.userService.updateStatus(user._id, true)
                return response
                //this.userService.updateReduceHours(user._id, response.hours)
            }
            if (response == null) {
                currentDate.add(-1, 'hours').toISOString()
                let query = {
                    _id: id,
                    start: {
                        $gte: currentDate.toISOString(),
                        $lte: currentDate.add(1, 'hours').toISOString()
                    },
                    active: false,
                    "seats.1": { "$exists": false }
                }
                let updateQuery: any = {
                    active: true,
                    $push: {
                        seats: {
                            userCode: user.userCode,
                            name: user.name
                        }
                    }
                }
                // console.log('response',query, updateQuery)
                let responseSecondary = await this.reservationModel.findOneAndUpdate(query, updateQuery)
                // console.log('response',responseSecondary)
                // console.log('response', JSON.stringify(responseSecondary))
                if(responseSecondary != null){
                    let duration = moment.duration(moment(responseSecondary.end).diff(moment(responseSecondary.start)));
                    let hours = duration.asHours();
                    // TODO: CODE BELOW NEEDS TO BE REFACTORED, CODE COULD BE REUSED.
                    if (responseSecondary.userSecondaryCode == user.userCode) {
                        if (user.hoursLeft.secondaryHours >= hours) {
                            this.userService.updateReduceHoursSecondary(user._id, user.hoursLeft.secondaryHours - hours)
                            this.userService.updateStatus(user._id, true)
                            return responseSecondary
                        }
                        updateQuery = {
                            active: false,
                            $pull: { 'seats': { userCode: user.userCode } }
                        }
                        this.reservationModel.findOneAndUpdate(query, updateQuery)
                        throw new HttpException({ code: 13, message: 'Secondary user does not have enough hours' }, 409)
    
                    }
                    if (responseSecondary.userCode == user.userCode) {
                        if (user.hoursLeft.todayHours >= hours) {
                            this.userService.updateReduceHours(user._id, user.hoursLeft.todayHours - hours)
                            this.userService.updateStatus(user._id, true)
                            return responseSecondary
                        }
                        updateQuery = {
                            active: false,
                            $pull: { 'seats': { userCode: user.userCode } }
                        }
                        this.reservationModel.findOneAndUpdate(query, updateQuery)
                        throw new HttpException({ code: 13, message: 'Primery user does not have enough hours' }, 409)
                    }
                    else {
                        updateQuery = {
                            active: false,
                            $pull: { 'seats': { userCode: user.userCode } }
                        }
                        this.reservationModel.findOneAndUpdate(query, updateQuery)
                        throw new HttpException({ code: 13, message: 'User is not able to activate' }, 409)
    
                    }
                }
                else throw new HttpException({ code: 13, message: 'Cannot activate room' }, 409)

            }
            throw new HttpException({ code: 11, message: 'User cannot activate this room' }, 400)
        }
        else throw new HttpException({ code: 10, message: 'User already in room' }, 400)

    }


    async joinReservation(id, user) {
        // IF PUBLIC update reservation resources

        //ELSE JUST JOIN
        let updateQuery: any = {
            $push: {
                seats: {
                    userCode: user.userCode,
                    name: user.name
                }
            }
        }
        await this.reservationModel.update({ _id: id, active: true },
            updateQuery)

        throw new HttpException('Reservation not active', 400)

    }

    async openToPublic(id, body:PutPublicReservationDto, user) {
        let currentDate = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        let query = {
            userCode: user.userCode,
            _id: id,
            active: true, 
            start: { "$gte": currentDate.toISOString() }
        }
        let reservation = await this.reservationModel.findOne(query)
        if (reservation != null && reservation?.public != true) {
            // reservation.public = true
            // reservation.publicFeatures= body
            // let res = await reservation.save()
            let res = await this.reservationModel.updateOne({ _id: id }, {
                "$set": {
                    public: true,
                    publicFeatures: body.features,
                    theme: body.theme
                }
            }, { multi: true })
            return this.reservationModel.findOne(query)
        }
        throw new HttpException('Not valid reservation', 409)
    }
    async cancelReservation(reservationId: string, user: User) {
        let query = {
            _id: reservationId,
            active: false,
        }
        let reservation = await this.reservationModel.findOne(query)
        let duration = moment.duration(moment(reservation.end).diff(moment(reservation.start)));
        let hours = duration.asHours();
        if (moment(reservation.start).date() == moment().date()) {
            this.userService.updateReduceHours(user._id, user.hoursLeft.todayHours + hours)
        }
        else if (moment(reservation.start).date() == moment().date() + 1) {
            let hoursLeft = user.hoursLeft.tomorrowHours + hours
            this.userService.updateReduceHours(user._id, hoursLeft, true)
        }
        else throw new HttpException("Active reservation", 409)

        this.availableService.addAvailable(JSON.parse(JSON.stringify(reservation)), hours)

        return await this.reservationModel.findOneAndRemove(query)
    }

    async getOneById(id): Promise<ReservationDto> {
        return this.reservationModel.findOne({ _id: id })
    }
    async getFree() {
        return this.reservationModel.find({})
    }
    async saveNew(reservation: ReservationDto) {
        const reservationSave = new this.reservationModel(reservation)
        return await reservationSave.save()
    }
    async reserve(body: PostReservationDto, user: User) {
        
        let rooms = await this.availableService.getAvailableRooms({
            code: body.room.code,
            start: body.start,
            office: body.room.office,
            hours: body.hours
        })
        // console.log("rooms", rooms)
        if (rooms.length != body.hours) new HttpException('Not enough available rooms', 400)
        if (user.userCode == body.userSecondaryCode) new HttpException('UserCode and Secondary Code are the same', 400)
        let userSecondary = await this.userService.findOneUserCode(body.userSecondaryCode)
        if (!userSecondary) new HttpException('Secondary User does not exist', 400)
        // console.log(user.hoursLeft, user.hoursLeft.todayHours < body.hours, user.hoursLeft.tomorrowHours < body.hours, moment(body.start).date() == moment().date(), moment(body.start).date() == moment().date() + 1)
        if (moment(body.start).date() == moment().date()) {
            if (user.hoursLeft.todayHours < body.hours) {
                throw new HttpException('Not enough Hours', 409)
            }
            this.userService.updateReduceHours(user._id, user.hoursLeft.todayHours - body.hours)
        }
        else if (moment(body.start).date() == moment().date() + 1) {
            if (user.hoursLeft.tomorrowHours < body.hours) {
                throw new HttpException('Not enough Hours', 409)
            }
            this.userService.updateReduceHours(user._id, user.hoursLeft.tomorrowHours - body.hours, true)
        }
        this.availableService.deleteRooms(body)
        let bodyToSave = new ReservationDto()

        bodyToSave.active = false
        bodyToSave.start = moment(body.start).utc();
        bodyToSave.end = moment(body.start).add(body.hours, 'hours').utc();
        bodyToSave.room = {
            seats: rooms[0].available[0].seats,
            office: rooms[0].available[0].office,
            code: rooms[0].available[0].code,
            features: rooms[0].available[0].features
        }
        bodyToSave.seats = []
        bodyToSave.userCode = user.userCode
        bodyToSave.userSecondaryCode = body.userSecondaryCode.toUpperCase()
        bodyToSave.public = false
        bodyToSave.publicFeatures = []
        bodyToSave.theme = ''
        return await this.saveNew(bodyToSave)
    }

    async joinPublic(body: PostJoinPublicDto, id: string, user: User) {
        if (user.inRoom) throw new HttpException({ code: 2, message: 'User Already in room' }, 409)
        let query = {
            _id: id,
            active: true,
            public: true
        }

        let reservation: ReservationDto = await this.reservationModel.findOne(query)
        if (reservation != null) {
            if (  reservation.seats.length <= reservation.room.seats) {
                let reservationObj = JSON.parse(JSON.stringify(reservation))
                for (let i = 0; i < body.features.length; i++) {
                    let index = reservationObj.publicFeatures.indexOf(body.features[i])
                    if (index == -1) {
                        throw new HttpException({ code: 2, message: 'Feature not aviable' }, 409)
                    }
                    else {
                        reservationObj.publicFeatures.splice(index, 1)
                    }
                }

                let updateQuery: any = {
                    publicFeatures: reservationObj.publicFeatures,
                    $push: {
                        seats: {
                            userCode: user.userCode,
                            name: user.name,
                            features: body.features
                        }
                    }
                }
                this.userService.updateStatus(user._id, true)
                return await this.reservationModel.findOneAndUpdate(query, updateQuery)
            }
            else throw new HttpException({ code: 3, message: 'Reservation is full' }, 409)
        }
        else throw new HttpException({ code: 1, message: 'Reservation not found' }, 409)

    }
}
