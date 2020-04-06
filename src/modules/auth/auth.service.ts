import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Browser, Page, launch } from 'puppeteer';
import { async } from 'rxjs/internal/scheduler/async';
import { AuthDto } from './auth.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
const { Pool } = require('lightning-pool');
// const puppeteer = require('puppeteer');

@Injectable()
export class AuthService {
    puppeteerInstance: Browser
    puppeteerPage: Page
    puppeteerPool
    constructor(private userService: UserService) {
        this.createFactory()
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
            },
            validate: function (client) {

            }
        };

        var opts = {
            max: 3, 
            min: 1,
            minIdle: 2
        }

        this.puppeteerPool = new Pool(factory, opts)
    }

    async upbWebTestPool(username, password) {
        let page: Page = await this.puppeteerPool.acquire()
        try {
            await page.focus('#user_id');
            await page.keyboard.type(username);
            await page.focus('#password');
            await page.keyboard.type(password);
            await page.click('#entry-login');
            await page.waitFor(200);
            let response = await page.evaluate(() => {
                try {
                    return document.getElementById('loginErrorMessage').textContent;
                } catch (e) {
                    return null;
                }
            });
            console.log('resp', response);
            this.puppeteerPool.release(page)
            if (response)
                throw new BadRequestException(response);
            return {
                statusCode: 200,
                message: 'Ok'
            }
        } catch (error) {
            this.puppeteerPool.release(page)    
            throw error
        }
    }

    upcApi() {

    }

    async loginUser() {

        let response = await this.upcApi()
        return
    }
    async loginUserExp(body:AuthDto) {
        let response = await this.upbWebTestPool(body.userCode, body.password)
        if(response.statusCode == 200){
            let user = new User()
            //this.userService.saveNewUser()
        }
        return response
    }

}
