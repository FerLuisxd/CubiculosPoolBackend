import { Injectable, BadRequestException } from '@nestjs/common';
import { Browser, Page, launch } from 'puppeteer';
import { ReservationDto } from './reservation.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { Pool } from 'lightning-pool';
import { puppetterLogin } from '../../utils/puppetter';
import { JWTsign } from '../../utils/jwt';
// const puppeteer = require('puppeteer');
/* eslint-disable prefer-const*/

@Injectable()
export class ReservationService {
    puppeteerInstance: Browser
    puppeteerPage: Page
    puppeteerPool
    constructor(private readonly userService: UserService) {
    }

    async upbWebTestPool(userCode, password) {
        return
    }

    async loginUserExp(body: ReservationDto) {
        let response = await this.upbWebTestPool(body.userCode, body.password)
       return
    }

}
