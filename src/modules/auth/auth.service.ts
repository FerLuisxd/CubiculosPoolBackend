import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Browser, Page, launch } from 'puppeteer';
import { async } from 'rxjs/internal/scheduler/async';
const { Pool } = require('lightning-pool');
// const puppeteer = require('puppeteer');

@Injectable()
export class AuthService {
    puppeteerInstance: Browser
    puppeteerPage: Page
    puppeteerPool
    constructor() {
        this.createFactory()
    }

    createFactory() {
        const factory = {
            create: async function (opts) {
                console.debug('Starting instance')
                console.time('startInstance')
                let browser = await launch({
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                })
                let page = await browser.newPage()
                await page.goto('https://aulavirtual.upc.edu.pe/',{  timeout:6000})
                console.timeEnd('startInstance')
                return page
            },
            destroy: function (client: Page) {
                console.debug('Destroying instance')
                return client.goto('https://aulavirtual.upc.edu.pe/',{  timeout:6000})
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
            minIdle: 1
        }

        this.puppeteerPool = new Pool(factory, opts)
    }

    async upbWebTestPool(username, password) {
        try {
            let page: Page = await this.puppeteerPool.acquire()
            console.log(page instanceof Object,typeof page)
            await page.screenshot({
                path: "./screenshot.jpg",
                type: "jpeg",
                fullPage: true
            });            
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
            return 'Ok credidentials'
        } catch (error) {
            throw error
        }
    }

    async upcWebTest(username, password) {
        if (!this.puppeteerInstance) {
            this.puppeteerInstance = await launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
        }
        if (!this.puppeteerPage) {
            this.puppeteerPage = await this.puppeteerInstance.newPage();
        }
        await this.puppeteerPage.goto(
            'https://aulavirtual.upc.edu.pe/',
            { waitUntil: 'networkidle2' },
        );
        console.log('Instances ready');
        await this.puppeteerPage.waitForSelector('#user_id', {
            timeout: 300,
        });
        await this.puppeteerPage.focus('#user_id');
        await this.puppeteerPage.keyboard.type(username);
        await this.puppeteerPage.focus('#password');
        await this.puppeteerPage.keyboard.type(password);
        // await this.puppeteerPage.screenshot()
        await this.puppeteerPage.click('#entry-login');
        await this.puppeteerPage.waitFor(700);
        let response = await this.puppeteerPage.evaluate(() => {
            try {
                let error = document.getElementById('loginErrorMessage').textContent;
                return error;
            } catch (e) {
                return null;
            }
        });
        console.log('resp', response);
        await this.puppeteerPage.reload();
        if (response)
            throw new NotFoundException(
                response
            );
        else
            return 'Ok credidentials'
    }

    upcApi() {

    }

    async loginUser() {

        let response = await this.upcApi()
        return
    }
    async loginUserExp(body) {

        let response = await this.upbWebTestPool(body.username, body.password)
        return response
    }

}
