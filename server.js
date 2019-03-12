'use strict';

const express = require('express');
const puppeteer = require('puppeteer');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
var counter = 0;
var blockedCounter = 0;
let scrape = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://www.sahibinden.com/ilan/emlak-konut-satilik-b.duzu-metrobuse-5dk-125m2-tertemiz-daire-iskanli-yeni-yapi-654470042/detay', { waitUntil: 'networkidle2' });

    const result = await page.evaluate(() => {
        let data = [];
        const featureArticle = document
            .evaluate(
                '//*[@id="classifiedDetail"]/div[1]/div[1]/h1',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            )
            .singleNodeValue;

            if (featureArticle == null) {               
                return 'Blocked!';
            } else {                
                return featureArticle.textContent;
            }
        
    });

    browser.close();
    return result;
};

app.get('/', (req, res) => {
    setInterval(Interval, 1000);
});
function Interval() {
    scrape().then((value) => {
        if (value == 'Blocked!') {
            blockedCounter++;
        } else {
            counter++;
        }
        console.log('value: ', value);
        console.log('requestCounter :', counter);
        console.log('blockedrequestCounter :', blockedCounter);
        
        return value;
    });
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);




