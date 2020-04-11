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
        const response =  await page.evaluate(() => {
            try {
                let  user = document.getElementById("global-nav-link").textContent;
                user = user.substring(0,user.length - 28)
                return {
                    valid: true,
                    user
                }
            } catch (e) {
                console.log("error",e)
                const errormsg = document.getElementById('loginErrorMessage')?.textContent ?? "error"
                return {
                    valid: false,
                    errormsg
                }
            }
        });
        return response
   
}
