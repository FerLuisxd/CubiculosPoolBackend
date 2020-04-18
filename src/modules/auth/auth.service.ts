import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { Browser, Page, launch } from 'puppeteer';
import { AuthDto } from './auth.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { Pool } from 'lightning-pool';
import { puppetterLogin } from '../../utils/puppetter';
import { JWTsign } from '../../utils/jwt';
// const puppeteer = require('puppeteer');
/* eslint-disable prefer-const*/

@Injectable()
export class AuthService {
    puppeteerPool
    constructor(private readonly userService: UserService) {
        this.createFactory()
    }

    async upbWebTestPool(userCode, password,boolean) {
        let page: Page;
        if(boolean){
            let browser = await launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
            page = await browser.newPage()
            await page.goto('https://aulavirtual.upc.edu.pe/', { timeout: 10000 })
        }
        else page = await this.puppeteerPool.acquire()

        let response 
        try {
            response = await puppetterLogin(page, userCode, password)
            page.goto('https://aulavirtual.upc.edu.pe/', { timeout: 10000 })
            this.puppeteerPool.release(page)
        } catch (error) {
            page.goto('https://aulavirtual.upc.edu.pe/', { timeout: 10000 })
            this.puppeteerPool.release(page)
            throw new HttpException(error,500);
        }
        if (response?.valid === true && response?.user)
            return response
        throw new BadRequestException(response);
    }

    async loginUser() {
        return "hi"
    }
    async loginUserExp(body: AuthDto,flag = false) {
        let response = await this.upbWebTestPool(body.userCode, body.password,flag)
        if (response.valid === true) {
            let schema: User = new User(body)
            schema.name = response.user
            let user = await this.userService.findOne(schema)
            if (!user) {
                user = await this.userService.saveNew(schema)
                console.log(user)
            }
            let jwt = JWTsign(user)
            return {
                name: user.name,
                token: jwt
            }
        }
    }

    createFactory() {
        const factory = {
            create: async function () {
                console.debug('Starting instance')
                let browser = await launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
                let page = await browser.newPage()
                await page.goto('https://aulavirtual.upc.edu.pe/', { timeout: 10000 })
                return page
            },
            destroy: function (client: Page) {
                console.debug('Destroying instance')
                return client.browser().close()
            },
            reset: function (client: Page) {
                console.debug('Reseting Instance')
                if(client.url?.() !='https://aulavirtual.upc.edu.pe/' ) return client.goto('https://aulavirtual.upc.edu.pe/', {  timeout: 8000 }) 
                return 
            },
            validate: async function(client){       
                if(client.url?.() !='https://aulavirtual.upc.edu.pe/' ) await client.goto('https://aulavirtual.upc.edu.pe/', {  timeout: 8000 }) 
                return  client
            }
        };

        const opts = {
            max: 4,
            min: 1,
            minIdle: 2
        }

        this.puppeteerPool = new Pool(factory, opts)
    }

}
