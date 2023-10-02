const puppeteer = require('puppeteer');

async function crawlWebsite(username, password) {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Configure Puppeteer to capture console output from the page
        page.on('console', message => {
            console.log(`From page: ${message.text()}`);
        });

        await page.goto('https://portal.chuka.ac.ke/');
        console.log('Navigated to portal.chuka.ac.ke');

        // Login
        await page.type('#username', username);
        console.log('Typed in username');
        await page.type('#userpassword', password);
        console.log('Typed in password');
        await page.click('#btnLogin');
        console.log('Clicked login button');
        await page.waitForNavigation({ waitUntil: 'load' });
        console.log('Navigation completed after login');

        // Extract desired data
        const data = await page.evaluate(() => {
            try {
                // Function to trim and get text content from a CSS selector
                const extractText = (selector) => {
                    const element = document.querySelector(selector);
                    return element ? element.textContent.trim() : null;
                };

                return {
                    regNo: extractText('.col-sm-6:nth-child(1) .row:nth-child(1) .badge'),
                    name: extractText('.col-sm-6:nth-child(1) .row:nth-child(2) .badge'),
                    idNo: extractText('.col-sm-6:nth-child(1) .row:nth-child(3) .badge'),
                    gender: extractText('.col-sm-6:nth-child(1) .row:nth-child(4) .badge'),
                    address: extractText('.col-sm-6:nth-child(2) .row:nth-child(1) .badge'),
                    email: extractText('.col-sm-6:nth-child(2) .row:nth-child(2) .badge'),
                    dob: extractText('.col-sm-6:nth-child(2) .row:nth-child(3) .badge'),
                    campus: extractText('.col-sm-6:nth-child(2) .row:nth-child(4) .badge')
                };
            } catch (error) {
                console.error('Error during data extraction:', error);
                return null;
            }
        });


        console.log('Data extracted:', data);
        await browser.close();
        return data;

    } catch (error) {
        console.error('Error during the crawlWebsite function:', error);
        if (browser) await browser.close();
        throw error; // re-throwing the error so the caller can handle it
    }
}

module.exports = {
    crawlWebsite
};
