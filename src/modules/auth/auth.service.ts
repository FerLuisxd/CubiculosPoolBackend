import { Injectable, BadRequestException } from '@nestjs/common';
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
    upcPage:string
    puppeteerArgs
    constructor(private readonly userService: UserService) {
        this.createFactory()
        this.upcPage= 'https://aulavirtual.upc.edu.pe/'
        this.puppeteerArgs ={timeout: 10000 }
    }

    async upbWebTestPool(userCode, password) {
        let page: Page = await this.puppeteerPool.acquire()
        let response 
        try {
            response = await puppetterLogin(page, userCode, password)
            page.goto( this.upcPage, { waitUntil:['networkidle2'],timeout: 10000 })
            this.puppeteerPool.release(page)
        } catch (error) {
            page.goto( this.upcPage, {  waitUntil:['networkidle2'],timeout: 10000 })
            this.puppeteerPool.release(page)
            throw new BadRequestException(error);
        }
        if (response?.valid === true && response?.user)
            return response
        throw new BadRequestException(response);

    }

    async loginUser() {
        return
    }
    async loginUserExp(body: AuthDto) {
        let response = await this.upbWebTestPool(body.userCode, body.password)
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
                let browser = await launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--single-process'] })
                let page = await browser.newPage()
                page.goto( this.upcPage, this.puppeteerArgs )
                return page
            },
            destroy: function (client: Page) {
                console.debug('Destroying instance')
                return client.browser().close()
            },
            reset: function (client: Page) {
                console.debug('Reseting Instance')
                if(client.url?.() != this.upcPage ) return client.goto( this.upcPage, this.puppeteerArgs ) 
                return 
            },
            validate: async function(client){       
                if(client.url?.() != this.upcPage ) await client.goto( this.upcPage, this.puppeteerArgs ) 
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
