const {Builder, By, Key, action, until, Capabilities} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome'); 

require('./common-utils');
require('./staking_table');
const fs = require("fs");

global.TEST_CONFIG = require("../test_config.json");
require("./logger")





global.ele_can_click = async function(selector){
    let ele = null
    try {
        ele = await find_ele(selector)
    }catch (e) {
        log.error(e);
        log.error(`find element ${[',', '#'].indexOf(selector[0]) > -1 ? selector : ('#' + selector)}`);
        throw e;
    }
    return (ele && await ele.isDisplayed() && await ele.isEnabled()) ? ele : null
}

global.find_ele = async function(selector) {
    log.info(`find element ${[',', '#'].indexOf(selector[0]) > -1 ? selector : ('#' + selector)}`)
    return await driver.findElement(By.css(`${[',', '#'].indexOf(selector[0]) > -1 ? selector : ('#' + selector)}`));
}

global.find_eles = async function(selector) {
    return await driver.findElements(By.css(`${[',', '#'].indexOf(selector[0]) > -1 ? selector : ('#' + selector)}`));
}

global.click = async function(selector, time = TEST_CONFIG.wait_time){
    let ele = await ele_can_click(selector)
    if(ele) {
        await ele.click();
        log.info(`clicked element ${[',', '#'].indexOf(selector[0]) > -1 ? selector : ('#' + selector)}`);
        await driver.sleep(time)
    }
}

global.input = async function(selector, key = '', time = TEST_CONFIG.wait_time) {
    await (await find_ele(selector)).clear();
    await (await find_ele(selector)).sendKeys(key);
    await driver.sleep(time)
}

global.executeScript = async function (script, time = TEST_CONFIG.wait_time) {
    const res = await driver.executeScript(script)
    await driver.sleep(time)
    return res;
}

global.screenshot = async function(fileName, dirName = log.log_dir()){
    const screenshot_base64 = await driver.takeSreenshot();
    let screenshot_data = screenshot_base64.replace(/^data:image.png;base64,/, "");

    if (!fs.existsSync(dirName)){
        fs.mkdirSync(dirName);
    }
    return fs.writeFile(dirName+"/"+fileName+".png",screenshot_data);
}




global.start = async function(driverName = "chrome"){
    if(driverName == "chrome"){
        if (process.env.chromedriver) {
            await chrome.setDefaultService(new chrome.ServiceBuilder(process.env.chromedriver).build());
        }
        global.driver = await new Builder().forBrowser('chrome').build();
        log.info("opening Chrome browser");

        await driver.get(TEST_CONFIG.url);
        await driver.sleep(TEST_CONFIG.wait_time);
        if((await driver.getTitle()) == "Privacy error"){
            log.info("solve the privacy issue");
            await click("#details-button");
            await driver.sleep(TEST_CONFIG.short_timeout)
            await click("#proceed-link");
            await driver.get(TEST_CONFIG.relay_url);
            await click("details-button");
            await click("#proceed-link");
            await driver.sleep(TEST_CONFIG.short_timeout);
        }
        return driver.navigate().to(TEST_CONFIG.url);

    }else if(driverName == "electron"){
        console.log("app="+process.env.HOME+TEST_CONFIG.upk)
        let builder = new Builder().usingServer("http://localhost:9515")
            .disableEnvironmentOverrides() 
           .withCapabilities({
              chromeOptions: {
                  binary: process.env.HOME+"/"+TEST_CONFIG.upk,//'/home/aion/Desktop/si-amity-linux-x64-0.9.3-0310/si-linux-x64/si',//resources/app/electron.js',
                  windowTypes: [ "app", "webview" ]
            }
       })
    .forBrowser("electron")
            console.log(builder.getCapabilities());
            console.log(builder)
        global.driver = await builder
            .build();

        log.info("opening desktop applicatoin")
        await driver.sleep(TEST_CONFIG.long_timeout);
        return driver.wait(until.elementLocated(By.css("img.logo")), TEST_CONFIG.short_timeout);
        
    }else{
        log.error("Invalid test target");
        throw new Error("Invalid Test target. Current test suite only support for \"chrome\" and \“electron\".");
    }
}
