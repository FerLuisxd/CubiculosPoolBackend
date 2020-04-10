

export async function puppetterLogin(page, username, password) {
    await page.focus('#user_id');
    await page.keyboard.type(username);
    await page.focus('#password');
    await page.keyboard.type(password);
    await page.click('#entry-login');
    await page.waitFor(200);
    return await page.evaluate(() => {
        try {
            return document.getElementById('loginErrorMessage').textContent;
        } catch (e) {
            return null;
        }
    });
}
