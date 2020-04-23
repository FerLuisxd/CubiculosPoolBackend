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
// const puppeteer = require('puppeteer');
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

    async getFree(){
        return this.availableModel.find({})
    }
}
