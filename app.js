let twilio = require('twilio');
const puppeteer = require('puppeteer');

let client = new twilio(`${process.env["TWILIO_ACCOUNT_SID"]}`, `${process.env["TWILIO_AUTH_TOKEN"]}`);

cronJob = require('cron').CronJob;

let numbers = [];
let texts = [];


async function scrape(url){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    var i;
    for(i = 4; i <8;i++ ){
        let elHandle = await page.$x(`/html/body/div[2]/div[3]/div[1]/div[2]/div[3]/div[${i}]/div[1]/div[1]/text()[1]`);
        let txt = await page.evaluate(el => el.textContent, elHandle[0]);

        await texts.push(txt);
        await console.log(typeof txt);
    }
    await sendMsg(texts, numbers);
    browser.close();
}

function sendMsg(texts, numbers){
    for(var k = 0; k < texts.length; k++){
        for(var j=0; j < numbers.length; j++){
            let textJon = new cronJob('30 13 * * *', function(){
                client.messages.create({
                    to:numbers[j],
                    from:"",
                    body:texts[1] + '\n' + "From xxx",
                }, function(err, data){}).then(message =>console.log(message.sid));
            }, null, true);
        }
    }
}

scrape('https://www.goodreads.com/quotes/tag/inspirational?page=2');