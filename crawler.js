const puppeteer = require('puppeteer');

async function crawlWebsite(username, password) {
    let browser;
    try {
        browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();

        // Configure Puppeteer to capture console output from the page
        page.on('console', message => {
            console.log(`From page: ${message.text()}`);
        });

        //! [TEST DATA username=Eb6/46276/20&password=39093917]

        await page.goto('https://portal.chuka.ac.ke/', {timeout: 80000});
        console.log('Navigated to portal.chuka.ac.ke');

        // Login
        await page.type('#username', username);
        console.log('Typed in username');
        await page.type('#userpassword', password);
        console.log('Typed in password');
        await page.click('#btnLogin');
        console.log('Clicked login button');
        await page.waitForNavigation({waitUntil: 'load', timeout: 80000});
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

                    regNo: extractText('.modal-dialog-scrollable .col-sm-6:nth-child(1) .row:nth-child(1) .badge'),
                    name: extractText('.modal-dialog-scrollable .col-sm-6:nth-child(1) .row:nth-child(2) .badge'),
                    idNo: extractText('.modal-dialog-scrollable .col-sm-6:nth-child(1) .row:nth-child(3) .badge'),
                    gender: extractText('.modal-dialog-scrollable .col-sm-6:nth-child(1) .row:nth-child(4) .badge'),
                    address: extractText('.modal-dialog-scrollable .col-sm-6:nth-child(2) .row:nth-child(1) .badge'),
                    email: extractText('.modal-dialog-scrollable .col-sm-6:nth-child(2) .row:nth-child(2) .badge'),
                    dob: extractText('.modal-dialog-scrollable .col-sm-6:nth-child(2) .row:nth-child(3) .badge'),
                    campus: extractText('.modal-dialog-scrollable .col-sm-6:nth-child(2) .row:nth-child(4) .badge'),

                    // Extracting Academic Information and Fees
                    currentProgramme: extractText('.row > .col-md-3:nth-child(1) .card:nth-child(1) .row:nth-child(1) .badge'),
                    attemptedUnits: extractText('.row > .col-md-3:nth-child(1) .card:nth-child(1) .row:nth-child(2) .badge'),
                    registeredUnits: extractText('.row > .col-md-3:nth-child(1) .card:nth-child(1) .row:nth-child(3) .badge'),
                    totalBilled: extractText('.row > .col-md-3:nth-child(2) .card:nth-child(1) .row:nth-child(1) .badge'),
                    totalPaid: extractText('.row > .col-md-3:nth-child(2) .card:nth-child(1) .row:nth-child(2) .badge'),
                    feeBalance: extractText('.row > .col-md-3:nth-child(2) .card:nth-child(1) .row:nth-child(3) .badge'),

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
