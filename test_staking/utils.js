const clear_copy_refresh_arr = ['.copy', '.clear-address', '.refresh']

exports.switch_tabs_no_address = async function(except, how_many = 15) {
    const eles = await find_eles('staking .tab_nav > span')
    const len = eles.length
    for(let i = 0;i < how_many;i++) {
        await click(clear_copy_refresh_arr[get_num_from_0_to_less_n(clear_copy_refresh_arr.length)])
        const n = get_num_from_1_to_n(len)
        if(n !== except) await click(`staking .tab_nav>span:nth-child(${n})`)
        await click('modal-signin-close')
    }
}


exports.switch_tabs_visitor = async function(how_many = 20) {
    await signin_visitor()
    const eles = await find_eles('staking .tab_nav > span')
    const len = eles.length
    for(let i = 0;i < how_many;i++) {
        await click(`staking-copy-refresh-clear-button-group ${clear_copy_refresh_arr[get_num_from_0_to_less_n(clear_copy_refresh_arr.length)]}`)
        await click(`staking .tab_nav>span:nth-child(${get_num_from_1_to_n(len)})`)
        await signin_visitor()
    }
}

exports.switch_tabs_private_key   = async function(how_many = 20){
    await signin_private_key()
    const eles = await find_eles('staking .tab_nav > span')
    const len = eles.length
    for(let i = 0;i < how_many;i++) {
        await click(`staking-copy-refresh-clear-button-group ${clear_copy_refresh_arr[get_num_from_0_to_less_n(clear_copy_refresh_arr.length)]}`)
        await click(`staking .tab_nav>span:nth-child(${get_num_from_1_to_n(len)})`)
        await signin_private_key()
    }
}

exports.switch_tab_pool = async function() {
    await click('staking-tab-pools')
}

exports.switch_tab_delegation = async function() {
    await click('staking-tab-delegations')
}

exports.switch_tab_rewards = async function() {
    await click('staking-tab-rewards')
}
exports.switch_tab_finalization = async function() {
    await click('staking-tab-finalizations')
}

exports.switch_tab_commission_rate_changes = async function(){
    await click('staking-tab-commission-rate-changes')
}

exports.get_balance = async function(){
    let balance = parseFloat(await executeScript('return getState().balance.toFixed()'))
    let count = 5
    while((balance <= 0) && count > 0) {
        balance = parseFloat(await executeScript('return getState().balance.toFixed()'))
        console.log('balance:', balance)
        count--
        await driver.sleep(2000)
    }

    return balance
}


exports.open_register_modal = async function() {
    let ele = await ele_can_click('modal-pool-close')
    if(ele) return
    await click('register-edit-pool')
    let count = 5
    let ele1 = await ele_can_click('modal-signin-close')
    let ele2 = await ele_can_click('modal-pool-close')
    while((!ele1) && (!ele2) && (count > 0)) {
        ele = await ele_can_click('modal-pool-close')
        if(ele) return
        ele1 = await ele_can_click('modal-signin-close')
        ele2 = await ele_can_click('modal-pool-close')
        count--
        await click('register-edit-pool')
        await driver.sleep(500)
    }
}


exports.close_register_modal = async function() {
    let count = 5
    let ele = await ele_can_click('modal-pool-close')
    while((!ele) && (count > 0)) {
        ele = await ele_can_click('modal-pool-close')
        count--
        await driver.sleep(1000)
    }
    console.log('find modal pool close button:', !!ele)
    if(ele) await ele.click()
}

exports.get_commission_rate_changes_len = async function(){
    let len = await executeScript('return getState().commission_rate_changes.length')
    let count = 10
    while((!len) && (count > 0)) {
        len = await executeScript('return getState().commission_rate_changes.length')
        console.log('get commission rate changes len:', len)
        count--
        await driver.sleep(1000)
    }
    return len
}


