const { By, Until } = require('selenium-webdriver');
require('./table_utils')

global.close_or_open_modal_sign = async function(){
    log.info('close or open modal_sign')
    const modal_sign_can_click = await ele_can_click('#modal-signin-close')
    if(!modal_sign_can_click) {
        await click('#header-signin-out')
    } else await click('#modal-signin-close')
}

global.close_modal = async function(){
    log.info("Close the modal");
    let close_cross_imgs = await find_eles("svg[id$='-close']");
    log.debug("close image elements on current page"+close_cross_imgs.length);
    let close_btn_onScreen = await close_cross_imgs.filter(async(elem)=>{ 
                    return await elem.isDisplayed();
            })[0];
    return close_btn_onScreen.click();
}

global.click_back_img = async function(){
    log.info("Click '<-' image on the navigator");
    return click(".navigator svg");
}



global.signin_with_header_button = async function(type = 'private_key', mode = "standard", ...data) {
    log.info('signin with header button:', type, data)

    await click("#header-signin-out");
    if(await (await find_ele("#modal_signin")).isDisplayed()){
        await filling_signin_modal(type,mode,...data);
    }else{
        throw new Error("Signin Modal failed to open");
    }
}

global.filling_signin_modal = async function(type='private_key',mode = "standard", ...data){
    if(mode === 'pool'){
            let pool_option = await driver.findElement(By.xpath("//div[@value='pool']"));
            await pool_option.click();
            log.debug("check if pool mode is selected: " + await pool_option.getAttribute("class"));
    }
    if(type === 'private_key') {
        await click('#modal-signin-private-key-button');
        await input('#modal-signin-private-key-input', data[0]);
        await click('#modal-signin-private-key-signin');
    } else if (type === 'visitor') {
        await input('#modal-signin-input-browse-address', data[0]);
        await click('#modal-signin-browse-button');
    }else if (type === 'phrase'){
        await click('#modal-signin-mnemonic-phrase-button');
        await input('#modal-signin-mnemonic-textarea', data[0]);
        await click('#modal-signin-mnemonic-signin');
    }else{
        throw new Error("Invalid signin type");
    }
}




global.signout_from_staking = async function() {
    log.info('#signout from staking')
    await click('#sidebar-menu-staking')
    let ele = ele_can_click('#staking-copy-refresh-clear-button-group .clear-address')
    let count = 5
    while(!ele) {
        ele = ele_can_click('#staking-copy-refresh-clear-button-group .clear-address')
        count--
        await driver.sleep(TEST_CONFIG.wait_time)
    }
    if(ele) await click('#staking-copy-refresh-clear-button-group .clear-address')
}

global.signout_from_account = async function() {
    log.info('signout from account')
    await click('#sidebar-menu-account')
    const ele = ele_can_click('#account-copy-refresh-clear-button-group .clear-address')
    if(ele) await click('#account-copy-refresh-clear-button-group .clear-address')
}

global.signout_from_pool = async function() {
    log.info("signout from pool");
    goto_pool();
    await click(".clear-address");
}

global.get_num_from_1_to_n = function(n) {
    return Math.ceil(Math.random() * n)
}

global.get_num_from_0_to_less_n = function(n) {
    return Math.floor(Math.random() * n)
}

global.goto_dashboard = async function() {
    log.info('goto dashboard')
    return click('#sidebar-menu-dashboard')
}

global.goto_account = async function() {
    log.info('goto account')
    return click('#sidebar-menu-account')
}

global.goto_staking = async function() {
    log.info('goto staking')
    return click('#sidebar-menu-staking')
}

global.goto_pool = async function(){
    log.info("goto pool management");
    return click("#sidebar-menu-pool-management")
}

global.goto_pool_detail = async function(index){
    if(index==undefined){
        let poolnum = getState(".pools.length");
        index = get_num_from_0_to_less_n(poolnum);
    }
    return click_table_row("#staking-table-pools",index);
}


global.signout_from_header_button = async function() {
    log.info('signout from header button')
    const address = await executeScript('return getState().account.address')
    if(!address) return
    await close_or_open_modal_sign()
}

const pool_detial_buttons = ['pool-detail-delegate', 'pool-detail-undelegate', 'pool-detail-withdraw']

global.click_pool_detail_buttons_not_signin = async function() {
    log.info('click pool detail buttons not signin')
    for(let i = 0;i < 5;i++) {
        await click(pool_detial_buttons[get_num_from_0_to_less_n(pool_detial_buttons.length)])
        const ele = await ele_can_click('modal-signin-close')
        if(ele) await click('modal-signin-close')
        await click('pool-detail-back')
    }
}

global.click_pool_detail_buttons_private_key = async function() {
    log.info('click pool detail buttons with private key')
    for(let i = 0;i < 5;i++) {
        await click(pool_detial_buttons[get_num_from_0_to_less_n(pool_detial_buttons.length)])
        const ele = await ele_can_click('staking-console-back')
        if(ele) await click('staking-console-back')
        const ele2 = await ele_can_click('modal_staking_warning-cancel')
        if(ele2) await click('modal_staking_warning-cancel')
        await click('pool-detail-back')
    }
}

global.input_console = async function (amount) {
    log.info('input console:', amount)
    await input('staking-console-top-input', amount)
}

global.pop_submit_button = async function(){
    log.info('pop console transaction confirm modal')
    await click('staking-console-bottom-button')
}

global.submit_transaction = async function() {
    log.info('confirm transaction')
    const ele = await ele_can_click('modal-transaction-confirm-button')
    if(ele) await ele.click()
}

global.pool_detail_go_back = async function() {
    log.info('go back from pool detail')
    await click('pool-detail-back')
}

global.console_go_back = async function() {
    log.info('go back from console')
    await click('staking-console-back')
}

global.close_staking_warning_modal = async function(){
    log.info('close taking warning modal')
    const ele = await staking_warngin_modal_visible()
    if(ele) await click('modal_staking_warning-cancel')
}

global.staking_warngin_modal_visible = async function() {
    log.info('query if staking warning is visible')
    return await ele_can_click('modal_staking_warning-cancel')
}

global.pool_detail_delegate_button = async function(){
    log.info('get pool detail delegate button')
    await click('pool-detail-delegate')
    const ele = await staking_warngin_modal_visible()
    if(ele) {
        await ele.click()
        return false
    }
    return true
}

global.pool_detail_undelegate_button = async function(){
    log.info('get pool detail undelegate button')
    await click('pool-detail-undelegate')
    const ele = await staking_warngin_modal_visible()
    if(ele) {
        await ele.click()
        return false
    }
    return true
}

global.pool_detail_withdraw_button = async function(){
    log.info('get pool detail withdraw button')
    await click('pool-detail-withdraw')
    const ele = await staking_warngin_modal_visible()
    if(ele) {
        await ele.click()
        return false
    }
    return true
}


global.console_back_visible = async function() {
    log.info('query if console back button is visible')
    return await ele_can_click('staking-console-back')
}


global.get_delegations_len = async function() {
    let len = await executeScript('return Object.keys(getState().delegations).length')
    let count = 5
    while((!len) && (count > 0)) {
        len = await executeScript('return Object.keys(getState().delegations).length')
        count--
        await driver.sleep(2000)
    }
    log.info('get data delegations len:', len)
    return len
}


global.close_transaction_success_modal = async  function(count = 5){
    if(count < 1) return
    await driver.sleep(500)
    await close_staking_warning_modal()
    await close_transation_error()
    const ele = await ele_can_click('modal-transaction-success-back')
    log.info('try close transaction success modal:', !!ele)
    if(!ele) {
        return await close_transaction_success_modal(count - 1)
    }
    await ele.click()
}

global.close_transation_error = async function(){
    const ele = await ele_can_click('modal_transaction_error-close')
    if(ele) await ele.click()
    log.info('close transaction error modal')
}
global.click_console_pool_list = async function() {
    log.info('click console pool list select')
    await click('#staking-console-bottom-pool-list')
}

global.click_console_to_pool_list = async function() {
    log.info('click console to pool list select')
    await click('#staking-console-bottom-to-pool-list')
}

global.random_select_from_console_pool_list = async function() {
    log.info('select an pool from console pool list randomly')
    await click_console_pool_list()
    const list = await find_eles('staking-console-bottom-pool-list li')
    await (await find_ele(`staking-console-bottom-pool-list ul > li:nth-child(${get_num_from_1_to_n(list.length)})`)).click()
}

global.random_select_from_console_to_pool_list = async function() {
    log.info('select an pool from console to pool list randomly')
    await click_console_to_pool_list()
    const list = await find_eles('#staking-console-bottom-to-pool-list li')
    await (await find_ele(`#staking-console-bottom-to-pool-list ul > li:nth-child(${get_num_from_1_to_n(list.length)})`)).click()
}

global.click_console_top_full_amount = async function() {
    log.info('click console top full amount button')
    await click('console-top-full-amount')
}


async function signin_private_key(){
    await signin_with_header_button('private_key', TEST_CONFIG.test_accounts.private_key.pk)
}
async function signin_visitor(){
    await signin_with_header_button('visitor', TEST_CONFIG.test_accounts.ledger["40"]);
}




global.signin_private_key = signin_private_key

global.signin_visitor = signin_visitor
