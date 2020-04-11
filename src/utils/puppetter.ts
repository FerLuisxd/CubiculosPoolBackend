import { Page } from "puppeteer";
const  upcPage = 'https://aulavirtual.upc.edu.pe/'
export async function puppetterLogin(page:Page, username, password) {
        await page.waitForSelector('#user_id',{timeout: 8000}) 
        await page.focus('#user_id');
        await page.keyboard.type(username);
        await page.focus('#password');
        await page.keyboard.type(password);
        await page.click('#entry-login');
        await page.waitFor(900);
        let response =  await page.evaluate(() => {
            try {
                let  user = document.getElementById("global-nav-link").textContent
                user = user.substring(0,user.length - 28)
                return {
                    valid: true,
                    user
                }
            } catch (e) {
                return {
                    valid:false,
                    errormsg: e
                }
            }
        });
        if(response.errormsg){
             response =  await page.evaluate(() => {
                try {
                    const errormsg = document.getElementById('loginErrorMessage')?.textContent
                    return {
                        valid: false,
                        errormsg
                    }
                } catch (e) {
                    return {
                        valid: false,
                        errormsg: e
                    }
                }
            });
        }
       
        return response
   
}
