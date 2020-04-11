import { Injectable, BadRequestException } from '@nestjs/common';
import { Browser, Page, launch } from 'puppeteer';
import { RoomDto } from './room.entity';
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
export class RoomService {

    constructor(@InjectModel('rooms') private roomModel: Model<any>) {

    }



    async loginUser() {
        return
    }
    async loginUserExp(body: RoomDto) {
        return
    }



}
