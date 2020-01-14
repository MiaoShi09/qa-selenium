global.click_table_row = async function (table, seq, call_back = async () => 0) {
    await click(`${table} tbody>tr:nth-child(${seq})`)
    await call_back()
}

global.click_table_single_button = async function(table, seq, button) {
    await click(`${table} tbody>tr:nth-child(${seq}) ${button}`)
}

global.click_table_single_header = async function(table, selector) {
    await click(`${table} thead  ${['.', '#'].indexOf(selector) > -1 ? selector : ('#' + selector)}`)
}
global.get_state = async function(data_name, if_len = false, if_obj = false) {
    let count = 5
    const script = if_len ? `return getState()['${data_name}'].length` : if_obj ? `return JSON.stringify(getState()['${data_name}'])` : `return getState()['${data_name}']`
    let pool_len = await executeScript(script)
    while((pool_len === 0) && (count > 0)) {
        pool_len = await executeScript(script)
        count--
    }
    return pool_len
}

global.click_table_rows = async function(let_table_visible, table_selector, data_name, call_back = async () => 0, how_many = 20) {
    if(let_table_visible) await click(let_table_visible)
    const ele = await find_ele(table_selector)
    if((!ele) || ! (await ele.isDisplayed())) throw `${table_selector} not show`
    let len = await get_state(data_name, true)
    if(len === 0) throw `can not get ${data_name} list`
    for(let i = Math.min(len, how_many);i > -1;i--) {
        await click_table_row(table_selector, get_num_from_1_to_n(len), call_back)
    }
}

global.click_table_buttons = async function(let_table_visible, table_selector, data_name, buttons, fallback = async () => 0, how_many = 20) {
    if(let_table_visible) await click(let_table_visible)
    const ele = await find_ele(table_selector)
    if((!ele) || ! (await ele.isDisplayed())) throw `${table_selector} not show`
    let len = await get_state(data_name, true)
    if(len === 0) throw `can not get ${data_name} list`
    console.log('len is:', len)
    for(let i = Math.min(len, how_many);i > -1;i--) {
        for(let i = 0;i < buttons.length;i++) {
            await click_table_single_button(table_selector, get_num_from_1_to_n(len), `${buttons[i][0] === '.' ? buttons[i] : ('.' + buttons[i])}`)
            await fallback()
        }
    }
}

global.test_table_header = async function(let_table_visible, table_selector, header_selectors, how_many = 6) {
    if(let_table_visible) await click(let_table_visible)
    const ele = await find_ele(table_selector)
    if((!ele) || ! (await ele.isDisplayed())) throw `${table_selector} not show`
    for(let i = 0;i < header_selectors.length;i++) {
        for(let j = 0;j < how_many;j++) await click_table_single_header(table_selector, header_selectors[i])
    }
}

global.close_or_open_modal_sign = async function(){
    const modal_sign_can_click = await ele_can_click('modal-signin-close')
    if(!modal_sign_can_click) {
        await click('header-signin-out')
    } else await click('modal-signin-close')
}


global.signin_with_header_button = async function(type = 'private_key', ...data) {
    const address_type = await executeScript('return getState().account.type')
    if(type === address_type) return
    const modal_sign_can_click = await ele_can_click('modal-signin-close')
    if(!modal_sign_can_click) await click('header-signin-out')

    if(type === 'private_key') {
        await click('modal-signin-private-key-button')
        await input('modal-signin-private-key-input', data[0])
        await click('modal-signin-private-key-signin')
    } else if (type === 'visitor') {
        await input('modal-signin-input-browse-address', data[0])
        await click('modal-signin-browse-button')
    }
}

global.signout_from_staking = async function() {
    await click('sidebar-menu-staking')
    const ele = ele_can_click('staking-copy-refresh-clear-button-group .close')
    if(ele) await click('staking-copy-refresh-clear-button-group .close')
}

global.signout_from_account = async function() {
    await click('sidebar-menu-account')
    const ele = ele_can_click('account-copy-refresh-clear-button-group .close')
    if(ele) await click('account-copy-refresh-clear-button-group .close')
}

global.get_num_from_1_to_n = function(n) {
    return Math.ceil(Math.random() * n)
}

global.get_num_from_0_to_less_n = function(n) {
    return Math.floor(Math.random() * n)
}

global.goto_dashboard = async function() {
    await click('sidebar-menu-dashboard')
}

global.goto_account = async function() {
    await click('sidebar-menu-account')
}

global.goto_staking = async function() {
    await click('sidebar-menu-staking')
}

const menus = ['sidebar-menu-staking', 'sidebar-menu-account', 'sidebar-menu-dashboard']

global.test_menus = async function () {
    for(let i = 0;i < 15;i++) {
        await click(menus[get_num_from_0_to_less_n(3)])
    }
}

global.signout_from_header_button = async function() {
    const address = await executeScript('return getState().account.address')
    if(!address) return
    await close_or_open_modal_sign()
}

const pool_detial_buttons = ['pool-detail-delegate', 'pool-detail-undelegate', 'pool-detail-withdraw']

global.click_pool_detail_buttons_not_signin = async function() {
    for(let i = 0;i < 5;i++) {
        await click(pool_detial_buttons[get_num_from_0_to_less_n(pool_detial_buttons.length)])
        const ele = await ele_can_click('modal-signin-close')
        if(ele) await click('modal-signin-close')
        await click('pool-detail-back')
    }
}

global.click_pool_detail_buttons_private_key = async function() {
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
    await input('staking-console-top-input', amount)
}

global.pop_submit_button = async function(){
    await click('staking-console-bottom-button')
}

global.submit_transaction = async function() {
    await click('modal-transaction-confirm-button')
}

global.pool_detail_go_back = async function() {
    await click('pool-detail-back')
}

global.console_go_back = async function() {
    await click('staking-console-back')
}

global.close_staking_warning_modal = async function(){
    const ele = await staking_warngin_modal_visible()
    if(ele) await click('modal_staking_warning-cancel')
}

global.staking_warngin_modal_visible = async function() {
    return await ele_can_click('modal_staking_warning-cancel')
}

global.pool_detail_delegate_button = async function(){
    await click('pool-detail-delegate')
    const ele = await staking_warngin_modal_visible()
    if(ele) {
        await ele.click()
        await pool_detail_go_back()
        return false
    }
    return true
}

global.console_back_visible = async function() {
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
    return len
}

global.close_transaction_success_modal = async  function(){
    await click('modal-transaction-success-back')
}
