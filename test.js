const {Builder, By, Key, action} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('./utils')
const { test_modal_sign } = require('./test_modal-sign')
const { test_menu_not_signin } = require('./test_menu')
const { test_dashboard_no_address, test_dashboard_visitor, test_dashboard_private } = require('./test_dashboard')
const { test_account_no_address, test_account_visitor, test_account_private_key } = require('./test_account')
const { test_staking_no_address, test_staking_visitor, test_staking_private_key, test_staking_delegate, test_staking_undelegate } = require('./test_staking')
const { test_console_not_signin } = require('./test_console')
global.driver = null

global.ele_can_click = async function(selector){
    let ele = null
    try {
        ele = await find_ele(selector)
    }catch (e) {
    }
    return (ele && await ele.isDisplayed()) ? ele : false
}

global.find_ele = async function(selector) {
    console.log('find:', `${[',', '#'].indexOf(selector[0]) > -1 ? selector : ('#' + selector)}`)
    return await driver.findElement(By.css(`${[',', '#'].indexOf(selector[0]) > -1 ? selector : ('#' + selector)}`));
}
global.find_eles = async function(selector) {
    console.log('find:', `${[',', '#'].indexOf(selector[0]) > -1 ? selector : ('#' + selector)}`)
    return await driver.findElements(By.css(`${[',', '#'].indexOf(selector[0]) > -1 ? selector : ('#' + selector)}`));
}
const default_time = 100
global.click = async function(selector, time = default_time){
    let ele = await ele_can_click(selector)
    if(ele) {
        await ele.click()
        await driver.sleep(time)
    } else console.log('warning:', 'element not found or not interacterable')
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

global.browse_with_address = async function () {
    await click('header-signin-out')
    await input('modal-signin-input-browse-address', '0xa095541186b2e53698244e231274a0754678664d2655d0e233aa3b9a03d21ef4')
    await click('modal-signin-browse-button')
}
global.clear_address = async function () {
    await click('staking-copy-refresh-clear-button-group .refresh')
}

chrome.setDefaultService(new chrome.ServiceBuilder('/usr/local/chromedriver').build());
(async function myFunction() {
    global.driver = await new Builder().forBrowser('chrome').build();
    await driver.get('https://localhost:3000');
    /*await test_dashboard_no_address()
    await test_dashboard_visitor()
    await test_dashboard_private()

    await test_account_no_address()
    await test_account_visitor()
    await test_account_private_key()
*/
    //await test_staking_no_address()
    //await test_staking_visitor()
    //await test_staking_private_key()
    // await test_staking_delegate()
    await test_staking_undelegate()
    // await test_table_row('sidebar-menu-staking', 'staking-table-pools', 'pools')
   /* await test_table_buttons(
        'sidebar-menu-staking',
        'staking-table-pools', 'pools',
        ['staking-table-pools-td-buttons .button'],
        async () => { await  click('modal-signin-close') })*/
   /*await test_table_header('sidebar-menu-staking', 'staking-table-pools',
       ['staking-pool', 'status', 'total-staked', 'self-bond', 'capacity', 'stake-weight', 'fees', 'performance'].map(v => `staking-table-pools-th-${v}`))*/
    // refresh
    /*await  driver.navigate().to('https://localhost:3000/staking')
    await driver.sleep(3000)
    await driver.navigate().refresh()
    await driver.sleep(2000)*/
    // await test_modal_sign()
    // await test_menu_not_signin()
    // await test_dashboard_not_signin()
    // await test_account_not_signin()
    // await test_staking_not_signin()
    // test_console_not_signin()
})().catch(err => {
    console.error('err occur:', err)
});

