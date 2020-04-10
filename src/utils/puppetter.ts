import { Page } from "puppeteer";

export async function puppetterLogin(page:Page, username, password) {
    await page.focus('#user_id');
    await page.keyboard.type(username);
    await page.focus('#password');
    await page.keyboard.type(password);
    await page.click('#entry-login');
    await page.waitFor(900);
    console.log('trying')
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
