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
        log.error(`finding element ${[',', '#','.'].indexOf(selector[0]) > -1 ? selector : ('#' + selector)}`);
        throw e;
    }
    return (ele && await ele.isDisplayed() && await ele.isEnabled()) ? ele : null
}

global.find_ele = async function(selector, parent = driver) {
    log.info(`finding element ${[',', '#','.'].indexOf(selector[0]) > -1 ? selector : ('#' + selector)}`)
    //return driver.findElement(By.css(`${[',', '#','.'].indexOf(selector[0]) > -1 ? selector : ('#' + selector)}`));
    return parent.findElement(By.css(selector));
}

global.find_eles = async function(selector) {
    return await driver.findElements(By.css(`${[',', '#','.'].indexOf(selector[0]) > -1 ? selector : ('#' + selector)}`));
}

global.click = async function(selector, time = TEST_CONFIG.wait_time){
    let ele = await ele_can_click(selector)
    if(ele) {
        await ele.click();
        log.info(`clicked element ${[',', '#'].indexOf(selector[0]) > -1 ? selector : ('#' + selector)}`);
        await driver.sleep(time)
    }else{
        throw new Error("unable to locate "+ selector);
    }
}

global.input = async function(selector, key = '', time = TEST_CONFIG.wait_time) {
    await (await find_ele(selector)).clear();
    await (await find_ele(selector)).sendKeys(key);
    return driver.sleep(time)
}

global.get_current_state = async function (detail) {
    return driver.executeScript("return getState()"+detail);
    //await driver.sleep(time)
    //return res;
}

global.screenshot = async function(fileName, dirName = log.log_dir()){
    const screenshot_base64 = await (await driver.findElement(By.css("body"))).takeSreenshot();
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

        await driver.get(TEST_CONFIG.domain.chrome);
        await driver.sleep(TEST_CONFIG.wait_time);
        await driver.manage().window().maximize();
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
        return driver.navigate().to(TEST_CONFIG.domain.chrome);

    }else if(driverName == "electron"){
        console.log("app="+process.env.HOME+TEST_CONFIG.upk)
        global.driver = await new Builder().usingServer("http://localhost:9515")
            .disableEnvironmentOverrides() 
           .withCapabilities({
                      chromeOptions: {
                          binary: process.env.HOME+"/"+TEST_CONFIG.upk,
                          windowTypes: [ "app", "webview" ]
                    }
               })
            .forBrowser("electron")  
            .build();

        log.info("opening desktop application")
        return driver.wait(until.elementLocated(By.css("img.logo")), TEST_CONFIG.short_timeout);
        
    }else{
        log.error("Invalid test target");
        throw new Error("Invalid Test target. Current test suite only support for \"chrome\" and \“electron\".");
    }
}
