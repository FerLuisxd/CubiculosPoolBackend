import { Injectable, HttpException } from '@nestjs/common';
import { ReservationDto } from './reservation.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AvailableService } from '../available/available.service';
import { PostReservationDto } from './dto/post.reservation.dto';
import * as moment from 'moment-timezone'
/* eslint-disable prefer-const*/

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
            userCode: userCode,
            start: {
                $gte: currentDate.toISOString(),
                $lte: currentDate.add(24, 'hours').toISOString()
            }
        }
        return this.reservationModel.find(query)
    }
    async getReservationByUserIdSecondary(userCode: string) {
        let currentDate = moment().tz("America/Lima").set({ minute: 0, second: 0, millisecond: 0 })
        let query = {
            userSecondaryCode: userCode,
            start: {
                $gte: currentDate.toISOString(),
                $lte: currentDate.add(24, 'hours').toISOString()
            }
        }
        return this.reservationModel.find(query)
    }

    async getActivated(userCode: string){
        let query = {
            userCode: userCode,
            active: true
        }
        return this.reservationModel.findOne(query)
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
            if (response != null) {
                this.userService.updateStatus(user._id, true)
                return response
                //this.userService.updateReduceHours(user._id, response.hours)
            }
            if (!response) {
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
                    console.log('response',query, updateQuery)
                    let responseSecondary = await this.reservationModel.findOneAndUpdate(query, updateQuery)
                    console.log('response',responseSecondary)
                    console.log('response', JSON.stringify(responseSecondary))
                    let duration = moment.duration(moment(responseSecondary.end).diff(moment(responseSecondary.start)));    
                    let hours = duration.asHours();
                    if (responseSecondary && user.hoursLeft.secondaryHours >= hours &&  responseSecondary.userSecondaryCode == user.userCode) {
                        console.log('hours', hours)
                        this.userService.updateReduceHoursSecondary(user._id, user.hoursLeft.secondaryHours - hours)
                        this.userService.updateStatus(user._id, true)
                        return responseSecondary
                    }
                    else{
                        updateQuery ={
                            active: false,
                             $pull: { 'seats': { userCode: user.userCode } } 
                        }
                        this.reservationModel.findOneAndUpdate(query, updateQuery)
                        throw new HttpException({ reasonCode: 3, reason: 'Secondary user does not have enough hours' }, 409)
                    }
            }
            throw new HttpException('User cannot activate this room', 400)
        }
        else throw new HttpException('User already in room', 400)

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
        console.log("rooms", rooms)
        if (rooms.length != body.hours) new HttpException('Not enough available rooms', 400)
        if (user.userCode == body.userSecondaryCode) new HttpException('UserCode and Secondary Code are the same', 400)
        let userSecondary = await this.userService.findOneUserCode(body.userSecondaryCode)
        if (!userSecondary) new HttpException('Secondary User does not exist', 400)
        console.log(user.hoursLeft, user.hoursLeft.todayHours < body.hours, user.hoursLeft.tomorrowHours < body.hours, moment(body.start).date() == moment().date(), moment(body.start).date() == moment().date() + 1)
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
        bodyToSave.userSecondaryCode = body.userSecondaryCode
        return await this.saveNew(bodyToSave)
    }
}
