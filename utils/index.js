const {Builder, By, Key, action} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('./common-utils')
require('./staking_table')
exports.start = async function(){
    await chrome.setDefaultService(new chrome.ServiceBuilder(process.env.chromedriver).build());
    global.driver = await new Builder().forBrowser('chrome').build();
    await driver.get('https://192.168.50.118:3000');
}



const default_time = 100

global.ele_can_click = async function(selector){
    let ele = null
    try {
        ele = await find_ele(selector)
    }catch (e) {
    }
    return (ele && await ele.isDisplayed()) ? ele : null
}

global.find_ele = async function(selector) {
    console.log(`find element ${[',', '#'].indexOf(selector[0]) > -1 ? selector : ('#' + selector)}`)
    return await driver.findElement(By.css(`${[',', '#'].indexOf(selector[0]) > -1 ? selector : ('#' + selector)}`));
}

global.find_eles = async function(selector) {
    return await driver.findElements(By.css(`${[',', '#'].indexOf(selector[0]) > -1 ? selector : ('#' + selector)}`));
}

global.click = async function(selector, time = default_time){
    let ele = await ele_can_click(selector)
    if(ele) {
        await ele.click()
        await driver.sleep(time)
    }
}

global.input = async function(selector, key = '', time = default_time) {
    await (await find_ele(selector)).clear();
    await (await find_ele(selector)).sendKeys(key);
    await driver.sleep(time)
}

global.executeScript = async function (script, time = default_time) {
    const res = await driver.executeScript(script)
    await driver.sleep(time)
    return res
}
