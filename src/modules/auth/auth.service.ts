import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Browser, Page, launch } from 'puppeteer';
import { async } from 'rxjs/internal/scheduler/async';
import { AuthDto } from './auth.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { Pool } from 'lightning-pool';
import { puppetterLogin } from './utils/puppetter';
import { JWTsign } from './utils/jwt';
// const puppeteer = require('puppeteer');
/* eslint-disable prefer-const*/

@Injectable()
export class AuthService {
    puppeteerInstance: Browser
    puppeteerPage: Page
    puppeteerPool
    constructor(private readonly userService: UserService) {
        this.createFactory()
    }

    async upbWebTestPool(userCode, password) {
        let page: Page = await this.puppeteerPool.acquire()
        try {
            let response = await puppetterLogin(page,userCode,password)
            this.puppeteerPool.release(page)
            if (response)
                throw new BadRequestException(response);
            return {
                status:200
            }
        } catch (error) {
            this.puppeteerPool.release(page)    
            throw error
        }
    }

    async createUser(userCode,password){
        let user:User = new User({userCode,password})
        let response = await this.userService.saveNewUser(user)
        return response
    }

    async loginUser() {
        return
    }
    async loginUserExp(body:AuthDto) {
        try {
            let response = await this.upbWebTestPool(body.userCode, body.password)
            if(response.status== 200){
                let createUser = await this.createUser(body.userCode,body.password)
                console.log(createUser)
                let jwt = JWTsign(createUser)
                return jwt
            } 
        } catch (error) {
            console.error(this.loginUserExp.name,error);
            throw error
        }

    }

    createFactory() {
        const factory = {
            create: async function (opts) {
                console.debug('Starting instance')
                let browser = await launch({
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                })
                let page = await browser.newPage()
                await page.goto('https://aulavirtual.upc.edu.pe/',{  timeout:6000})
                return page
            },
            destroy: function (client: Page) {
                console.debug('Destroying instance')
                return client.browser().close()
            },
            reset:  function (client: Page) {
                console.debug('Reseting Instance')
                return client.goto('https://aulavirtual.upc.edu.pe/',{  timeout:6000})
            }
        };

        const opts = {
            max: 3, 
            min: 1,
            minIdle: 2
        }

        this.puppeteerPool = new Pool(factory, opts)
    }

}
