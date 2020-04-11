import { Injectable, BadRequestException } from '@nestjs/common';
import { Browser, Page, launch } from 'puppeteer';
import { ReservationDto } from './reservation.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { Pool } from 'lightning-pool';
import { puppetterLogin } from '../../utils/puppetter';
import { JWTsign } from '../../utils/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// const puppeteer = require('puppeteer');
/* eslint-disable prefer-const*/

@Injectable()
export class ReservationService {

    constructor(@InjectModel('reservations') private reservationModel: Model<any>) {
    }

    async upbWebTestPool(userCode, password) {
        return
    }

    async loginUserExp(body: ReservationDto) {
        let response = await this.upbWebTestPool(body.userCode, body.password)
       return
    }

}
