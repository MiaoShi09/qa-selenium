exports.test_staking_no_address = async function() {
    await goto_staking()
    await switch_tabs_no_address()
    await click_table_rows('sidebar-menu-staking', 'staking-table-pools', 'pools', click_pool_detail_buttons_not_signin, 5)
    await click_table_buttons('sidebar-menu-staking', 'staking-table-pools', 'pools', ['button'], async () => {
        await click('modal-signin-close')
    }, 10)
    await test_table_header('sidebar-menu-staking', 'staking-table-pools',
        ['staking-pool', 'status', 'total-staked', 'self-bond', 'capacity', 'stake-weight', 'fees', 'performance'].map(v => `staking-table-pools-th-${v}`))
    await test_menus()
    await goto_staking()


    await signin_visitor()
    await signout_from_header_button()
    await signin_private_key()
    await signout_from_header_button()
    await signin_visitor()


    await switch_tab_delegation()
    await click('staking-copy-refresh-clear-button-group .clear-address')
    await switch_tabs_no_address(1)
    await test_table_header('', 'staking-tab-delegations',
        ['staking-pool', 'status', 'my-delegation', 'rewards', 'fees', 'performance'].map(v => `staking-table-delegations-${v}`))
    await click_table_buttons('', 'staking-tab-delegations', 'delegations', ['staking-table-delegations-td-buttons .undelegate', 'staking-table-delegations-td-buttons .transfer'], async () => {
        await click('modal-signin-close')
    }, 10)
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')
    await click(`staking-table-delegations tbody:nth-child(1)`)
    await click_pool_detail_buttons_not_signin()

    await switch_tab_rewards()
    await click('staking-copy-refresh-clear-button-group .clear-address')
    await switch_tabs_no_address(1)
    await test_table_header('', 'staking-table-rewards',
        ['staking-pool', 'status', 'my-delegation', 'rewards', 'fees', 'performance'].map(v => `staking-table-rewards-${v}`))
    await click_table_buttons('', 'staking-table-rewards', 'delegations', ['staking-table-rewards-switch', 'withdraw .button'], async () => {
        await click('modal-signin-close')
    }, 10)
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')
    await click(`staking-table-delegations tbody:nth-child(2)`)
    await click_pool_detail_buttons_not_signin()


    await switch_tab_finalization()
    await click('staking-copy-refresh-clear-button-group .clear-address')
    await switch_tabs_no_address(1)
    await test_table_header('', 'staking-table-finalizations',
        ['staking-table-finalizations-amount'])
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')
}



exports.test_staking_visitor = async function() {
    await goto_staking()
    await signin_visitor()
    await switch_tabs_visitor()
    await switch_tab_pool()
    await click_table_rows('', 'staking-table-pools', 'pools', click_pool_detail_buttons_not_signin, 5)
    await click_table_buttons('', 'staking-table-pools', 'pools', ['button'], async () => 0, 10)
    await test_table_header('', 'staking-table-pools',
        ['staking-pool', 'status', 'total-staked', 'self-bond', 'capacity', 'stake-weight', 'fees', 'performance'].map(v => `staking-table-pools-th-${v}`))
    await test_menus()
    await goto_staking()

    await signout_from_header_button()
    await signin_private_key()
    await signout_from_header_button()
    await signin_visitor()

    await switch_tabs_visitor()
    await switch_tab_delegation()
    await test_table_header('', 'staking-tab-delegations',
        ['staking-pool', 'status', 'my-delegation', 'rewards', 'fees', 'performance'].map(v => `staking-table-delegations-${v}`))
    await click_table_buttons('', 'staking-tab-delegations', 'delegations', ['staking-table-delegations-td-buttons .undelegate', 'staking-table-delegations-td-buttons .transfer'], async () => 0, 10)
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')
    await click_table_rows('', 'staking-tab-delegations', 'delegations', click_pool_detail_buttons_not_signin, 5)

    await switch_tab_rewards()
    await switch_tabs_visitor()
    await switch_tab_rewards()

    await test_table_header('', 'staking-table-rewards',
        ['staking-pool', 'status', 'my-delegation', 'rewards', 'fees', 'performance'].map(v => `staking-table-rewards-${v}`))
    await click_table_buttons('', 'staking-table-rewards', 'delegations', ['staking-table-rewards-switch', 'withdraw .button'], async () => 0, 10)
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')
    await click_table_rows('', 'staking-table-rewards', 'delegations', click_pool_detail_buttons_not_signin, 5)


    await switch_tab_finalization()
    await switch_tabs_visitor()
    await switch_tab_finalization()


    await test_table_header('', 'staking-table-finalizations',
        ['staking-table-finalizations-amount'])
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')
}

exports.test_staking_private_key = async function() {
    await goto_staking()
    await signin_private_key()
    const balance = await get_balance()
    if(balance <= 0) return
    //await switch_tabs_private_key()
    await switch_tab_pool()
    await click_table_rows('', 'staking-table-pools', 'pools', click_pool_detail_buttons_private_key, 5)
    await test_table_header('', 'staking-table-pools',
        ['staking-pool', 'status', 'total-staked', 'self-bond', 'capacity', 'stake-weight', 'fees', 'performance'].map(v => `staking-table-pools-th-${v}`))
    await click_table_buttons('', 'staking-table-pools', 'pools', ['button'], async () => {
        const ele = await ele_can_click('staking-console-back')
        if(ele) await click('staking-console-back')
        const ele2 = await ele_can_click('modal_staking_warning-cancel')
        if(ele2) await click('modal_staking_warning-cancel')
    }, 10)

    await test_menus()
    await goto_staking()


    await signout_from_header_button()
    await signin_visitor()
    await signout_from_header_button()
    await signin_private_key()

    await switch_tabs_private_key()
    await switch_tab_delegation()
    await test_table_header('', 'staking-tab-delegations',
        ['staking-pool', 'status', 'my-delegation', 'rewards', 'fees', 'performance'].map(v => `staking-table-delegations-${v}`))
    await click_table_buttons('', 'staking-tab-delegations', 'delegations', ['staking-table-delegations-td-buttons .undelegate', 'staking-table-delegations-td-buttons .transfer'], async () => {
        const ele = await ele_can_click('staking-console-back')
        if(ele) await click('staking-console-back')
        const ele2 = await ele_can_click('modal_staking_warning-cancel')
        if(ele2) await click('modal_staking_warning-cancel')
    }, 10)
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')
    await click_table_rows('', 'staking-tab-delegations', 'delegations', click_pool_detail_buttons_not_signin, 5)

    await switch_tab_rewards()
    await switch_tabs_private_key()
    await switch_tab_rewards()

    await test_table_header('', 'staking-table-rewards',
        ['staking-pool', 'status', 'my-delegation', 'rewards', 'fees', 'performance'].map(v => `staking-table-rewards-${v}`))
    await click_table_buttons('', 'staking-table-rewards', 'delegations', ['staking-table-rewards-switch', 'withdraw .button'], async () => {
        const ele = await ele_can_click('staking-console-back')
        if(ele) await click('staking-console-back')
        const ele2 = await ele_can_click('modal-transaction-confirm-close')
        if(ele2) await click('modal-transaction-confirm-close')
        const ele3 = await ele_can_click('modal_staking_warning-cancel')
        if(ele3) await click('modal_staking_warning-cancel')
    }, 10)
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')
    await click_table_rows('', 'staking-table-rewards', 'delegations', click_pool_detail_buttons_not_signin, 5)


    await switch_tab_finalization()
    await switch_tabs_visitor()
    await switch_tab_finalization()


    await test_table_header('', 'staking-table-finalizations',
        ['staking-table-finalizations-amount'])
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')
    await signout_from_header_button()
}

const clear_copy_refresh_arr = ['.copy', '.clear-address', '.refresh']

exports.test_staking_delegate = async function() {
    await goto_staking()
    await signin_private_key()
    const balance = await get_balance()
    if(balance <= 0) return
    const times = 3
    for(let i = 0;i < times;i++) {
        await pool_button_to_delegate()
    }

    for(let i = 0;i < times;i++) {
        await pool_detail_delegate((i === (times - 1)) ? false: true)
    }

    for(let i = 0;i < times;i++) {
        await random_select_pool_delegate()
        await driver.sleep(2000)
    }
}

async function pool_button_to_delegate(back = true){
    const len = await executeScript('return getState().pools.length')
    let flag = true
    while(flag) {
        await click_table_single_button('staking-table-pools', get_num_from_1_to_n(len), '.button')
        const ele = await ele_can_click('modal_staking_warning-cancel')
        if(ele) {
            await ele.click()
        } else flag = false
    }

    await input_console(0.3)
    await pop_submit_button()
    await submit_transaction()
    const bt = await get_transaction_result()
    if(bt) await bt.click()
    if(back) await console_go_back()
}

async function pool_detail_delegate(back = true){
    const len = await executeScript('return getState().pools.length')
    await click_table_row('staking-table-pools', get_num_from_1_to_n(len))
    const balance = await get_balance()
    if(balance < 3) return
    const go_head = await pool_detail_delegate_button()
    if(!go_head) {
        await pool_detail_go_back()
        return
    }
    await input_console(0.3)
    await pop_submit_button()
    await submit_transaction()
    const bt = await get_transaction_result()
    if(bt) await bt.click()
    if(!back) return
    await console_go_back()
    await pool_detail_go_back()
}


async function random_select_pool_delegate(){
    await click('staking-console-bottom-pool-list')
    const list = await find_eles('staking-console-bottom-pool-list li')
    console.log('list:', list.length)
    await (await find_ele(`staking-console-bottom-pool-list ul > li:nth-child(${get_num_from_1_to_n(list.length)})`)).click()
    await input_console(0.3)
    await pop_submit_button()
    await submit_transaction()
    const bt = await get_transaction_result()
    if(bt) await bt.click()
}

exports.test_staking_undelegate = async function() {
    await goto_staking()
    await signin_private_key()
    const balance = await get_balance()
    if(balance <= 0) return
    const times = 3
    await switch_tab_delegation()
    const len = await get_delegations_len()
    if(!len) console.warn('no delegations')
    for(let i = 0;i < times;i++) {
        await delegation_table_button_un_delegate(len, true)
    }
}

async function delegation_table_button_un_delegate(len, back){
    await click_table_single_button('staking-table-delegations', get_num_from_1_to_n(len), '.staking-table-delegations-td-buttons .undelegate')
    const console_back = await console_back_visible()
    if(!console_back) return
    await input_console(0.3)
    await pop_submit_button()
    await submit_transaction()
    await close_transaction_success_modal()
    if(back) await console_go_back()
}
const switch_tabs_no_address = async function(except, how_many = 15) {
    const eles = await find_eles('staking .tab_nav > span')
    const len = eles.length
    for(let i = 0;i < how_many;i++) {
        await click(clear_copy_refresh_arr[get_num_from_0_to_less_n(clear_copy_refresh_arr.length)])
        const n = get_num_from_1_to_n(len)
        if(n !== except) await click(`staking .tab_nav>span:nth-child(${n})`)
        await click('modal-signin-close')
    }
}

const switch_tabs_visitor = async function(how_many = 20) {
    await signin_visitor()
    const eles = await find_eles('staking .tab_nav > span')
    const len = eles.length
    for(let i = 0;i < how_many;i++) {
        await click(`staking-copy-refresh-clear-button-group ${clear_copy_refresh_arr[get_num_from_0_to_less_n(clear_copy_refresh_arr.length)]}`)
        await click(`staking .tab_nav>span:nth-child(${get_num_from_1_to_n(len)})`)
        await signin_visitor()
    }
}

async function switch_tabs_private_key(how_many = 20){
    await signin_private_key()
    const eles = await find_eles('staking .tab_nav > span')
    const len = eles.length
    for(let i = 0;i < how_many;i++) {
        await click(`staking-copy-refresh-clear-button-group ${clear_copy_refresh_arr[get_num_from_0_to_less_n(clear_copy_refresh_arr.length)]}`)
        await click(`staking .tab_nav>span:nth-child(${get_num_from_1_to_n(len)})`)
        await signin_private_key()
    }
}

async function test_staking_not_signin_staking_table_pool() {
    await click('sidebar-menu-staking')
    await click('staking-tab-pools')
    await click('staking-tab-pools')
    await click('staking-tab-delegations')
    await click('modal-signin-close')
    await click('staking-tab-rewards')
    await click('modal-signin-close')
    await click('staking-tab-finalizations')
    await click('modal-signin-close')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-table-pools tbody >tr:nth-child(2) .staking-table-pools-td-buttons .button')
    await click('modal-signin-close')
    await click('staking-table-pools tbody >tr:nth-child(3) .staking-table-pools-td-buttons .button')
    await click('modal-signin-close')
    await click('staking-table-pools tbody >tr:nth-child(4) .staking-table-pools-td-buttons .button')
    await click('modal-signin-close')
    await click('staking-table-pools tbody >tr:nth-child(5) .staking-table-pools-td-buttons .button')
    await click('modal-signin-close')
    await click('staking-table-pools tbody >tr:nth-child(7) .staking-table-pools-td-buttons .button')
    await click('modal-signin-close')
    await click('staking-table-pools tbody >tr:nth-child(1) .staking-table-pools-td-buttons .button')
    await click('modal-signin-close')
    await click('staking-table-pools tbody >tr:nth-child(9) .staking-table-pools-td-buttons .button')
    await click('modal-signin-close')
    await click('staking-table-pools tbody >tr:nth-child(10) .staking-table-pools-td-buttons .button')
    await click('modal-signin-close')
    await click('staking-table-pools tbody >tr:nth-child(17) .staking-table-pools-td-buttons .button')
    await click('modal-signin-close')
    await click('staking-table-pools tbody >tr:nth-child(13) .staking-table-pools-td-buttons .button')
    await click('modal-signin-close')

    await click('staking-table-pools-th-staking-pool')
    await click('staking-table-pools-th-staking-pool')
    await click('staking-table-pools-th-staking-pool')
    await click('staking-table-pools-th-staking-pool')
    await click('staking-table-pools-th-staking-pool')
    await click('staking-table-pools-th-staking-pool')

    await click('staking-table-pools-th-status')
    await click('staking-table-pools-th-status')
    await click('staking-table-pools-th-status')
    await click('staking-table-pools-th-status')
    await click('staking-table-pools-th-status')
    await click('staking-table-pools-th-status')

    await click('staking-table-pools-th-total-staked')
    await click('staking-table-pools-th-total-staked')
    await click('staking-table-pools-th-total-staked')
    await click('staking-table-pools-th-total-staked')
    await click('staking-table-pools-th-total-staked')
    await click('staking-table-pools-th-total-staked')

    await click('staking-table-pools-th-self-bond')
    await click('staking-table-pools-th-self-bond')
    await click('staking-table-pools-th-self-bond')
    await click('staking-table-pools-th-self-bond')
    await click('staking-table-pools-th-self-bond')
    await click('staking-table-pools-th-self-bond')

    await click('staking-table-pools-th-capacity')
    await click('staking-table-pools-th-capacity')
    await click('staking-table-pools-th-capacity')
    await click('staking-table-pools-th-capacity')
    await click('staking-table-pools-th-capacity')
    await click('staking-table-pools-th-capacity')

    await click('staking-table-pools-th-stake-weight')
    await click('staking-table-pools-th-stake-weight')
    await click('staking-table-pools-th-stake-weight')
    await click('staking-table-pools-th-stake-weight')
    await click('staking-table-pools-th-stake-weight')
    await click('staking-table-pools-th-stake-weight')

    await click('staking-table-pools-th-fees')
    await click('staking-table-pools-th-fees')
    await click('staking-table-pools-th-fees')
    await click('staking-table-pools-th-fees')
    await click('staking-table-pools-th-fees')
    await click('staking-table-pools-th-fees')

    await click('staking-table-pools-th-performance')
    await click('staking-table-pools-th-performance')
    await click('staking-table-pools-th-performance')
    await click('staking-table-pools-th-performance')
    await click('staking-table-pools-th-performance')
    await click('staking-table-pools-th-performance')

    await click('staking-table-pools tbody >tr:nth-child(2)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-pools tbody >tr:nth-child(3)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-pools tbody >tr:nth-child(4)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-pools tbody >tr:nth-child(5)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-pools tbody >tr:nth-child(7)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-pools tbody >tr:nth-child(1)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-pools tbody >tr:nth-child(9)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-pools tbody >tr:nth-child(10)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-pools tbody >tr:nth-child(17)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-pools tbody >tr:nth-child(13)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-copy-refresh-clear-button-group .refresh')
}
async function test_staking_not_signin_staking_table_delegations() {
    await click('sidebar-menu-staking')
    await click('header-signin-out')
    await input('modal-signin-input-browse-address', '0xa095541186b2e53698244e231274a0754678664d2655d0e233aa3b9a03d21ef4')
    await click('modal-signin-browse-button')

    await click('staking-tab-pools')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-tab-delegations')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-tab-rewards')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-tab-finalizations')
    await click('staking-copy-refresh-clear-button-group .refresh')


    await click('staking-tab-rewards')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-tab-delegations')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-tab-pools')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-tab-finalizations')
    await click('staking-copy-refresh-clear-button-group .refresh')

    await click('staking-tab-rewards')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-tab-pools')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-tab-finalizations')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-tab-delegations')
    await click('staking-copy-refresh-clear-button-group .refresh')

    await click('staking-table_delegations-staking-pool')
    await click('staking-table_delegations-staking-pool')
    await click('staking-table_delegations-staking-pool')
    await click('staking-table_delegations-staking-pool')
    await click('staking-table_delegations-staking-pool')
    await click('staking-table_delegations-staking-pool')

    await click('staking-table-delegations-status')
    await click('staking-table-delegations-status')
    await click('staking-table-delegations-status')
    await click('staking-table-delegations-status')
    await click('staking-table-delegations-status')
    await click('staking-table-delegations-status')

    await click('staking-table-delegations-my-delegation')
    await click('staking-table-delegations-my-delegation')
    await click('staking-table-delegations-my-delegation')
    await click('staking-table-delegations-my-delegation')
    await click('staking-table-delegations-my-delegation')
    await click('staking-table-delegations-my-delegation')

    await click('staking-table-delegations-rewards')
    await click('staking-table-delegations-rewards')
    await click('staking-table-delegations-rewards')
    await click('staking-table-delegations-rewards')
    await click('staking-table-delegations-rewards')
    await click('staking-table-delegations-rewards')


    await click('staking-table-delegations-fees')
    await click('staking-table-delegations-fees')
    await click('staking-table-delegations-fees')
    await click('staking-table-delegations-fees')
    await click('staking-table-delegations-fees')
    await click('staking-table-delegations-fees')


    await click('staking-table-delegations-performance')
    await click('staking-table-delegations-performance')
    await click('staking-table-delegations-performance')
    await click('staking-table-delegations-performance')
    await click('staking-table-delegations-performance')
    await click('staking-table-delegations-performance')



    await click('staking-copy-refresh-clear-button-group .clear-address')

    await click('staking-table-delegations tbody >tr:nth-child(2) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(2) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(2) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(2) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(2) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(2) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')

    await click('staking-table-delegations tbody >tr:nth-child(3) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(3) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(3) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(3) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(3) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(3) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')

    await click('staking-table-delegations tbody >tr:nth-child(4) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(4) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(4) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(4) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(4) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(4) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')

    await click('staking-table-delegations tbody >tr:nth-child(5) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(5) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(5) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(5) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(5) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(5) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')

    await click('staking-table-delegations tbody >tr:nth-child(7) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(7) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(7) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(7) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(7) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(7) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')

    await click('staking-table-delegations tbody >tr:nth-child(1) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(1) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(1) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(1) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(1) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(1) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')

    await click('staking-table-delegations tbody >tr:nth-child(9) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(9) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(9) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(9) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(9) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(9) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')

    await click('staking-table-delegations tbody >tr:nth-child(10) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(10) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(10) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(10) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(10) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(10) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')

    await click('staking-table-delegations tbody >tr:nth-child(11) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(11) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(11) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(11) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(11) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(11) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')

    await click('staking-table-delegations tbody >tr:nth-child(13) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(13) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(13) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(13) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(13) .staking-table-delegations-td-buttons>.button:first-child')
    await click('modal-signin-close')
    await click('staking-table-delegations tbody >tr:nth-child(13) .staking-table-delegations-td-buttons>.button:last-child')
    await click('modal-signin-close')

    await click('staking-table_delegations-staking-pool')
    await click('staking-table_delegations-staking-pool')
    await click('staking-table_delegations-staking-pool')
    await click('staking-table_delegations-staking-pool')
    await click('staking-table_delegations-staking-pool')
    await click('staking-table_delegations-staking-pool')

    await click('staking-table-delegations-status')
    await click('staking-table-delegations-status')
    await click('staking-table-delegations-status')
    await click('staking-table-delegations-status')
    await click('staking-table-delegations-status')
    await click('staking-table-delegations-status')

    await click('staking-table-delegations-my-delegation')
    await click('staking-table-delegations-my-delegation')
    await click('staking-table-delegations-my-delegation')
    await click('staking-table-delegations-my-delegation')
    await click('staking-table-delegations-my-delegation')
    await click('staking-table-delegations-my-delegation')

    await click('staking-table-delegations-rewards')
    await click('staking-table-delegations-rewards')
    await click('staking-table-delegations-rewards')
    await click('staking-table-delegations-rewards')
    await click('staking-table-delegations-rewards')
    await click('staking-table-delegations-rewards')


    await click('staking-table-delegations-fees')
    await click('staking-table-delegations-fees')
    await click('staking-table-delegations-fees')
    await click('staking-table-delegations-fees')
    await click('staking-table-delegations-fees')
    await click('staking-table-delegations-fees')


    await click('staking-table-delegations-performance')
    await click('staking-table-delegations-performance')
    await click('staking-table-delegations-performance')
    await click('staking-table-delegations-performance')
    await click('staking-table-delegations-performance')
    await click('staking-table-delegations-performance')


    await click('staking-tab-rewards')
    await click('modal-signin-close')
    await click('staking-tab-delegations')
    await click('modal-signin-close')
    await click('staking-tab-finalizations')
    await click('modal-signin-close')
    await click('staking-tab-delegations')
    await click('modal-signin-close')
    await click('staking-tab-rewards')
    await click('modal-signin-close')
    await click('staking-tab-finalizations')
    await click('modal-signin-close')

    await click('staking-table-delegations tbody >tr:nth-child(2)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-delegations tbody >tr:nth-child(3)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-delegations tbody >tr:nth-child(4)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-delegations tbody >tr:nth-child(5)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-delegations tbody >tr:nth-child(7)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-delegations tbody >tr:nth-child(1)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-delegations tbody >tr:nth-child(9)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-delegations tbody >tr:nth-child(10)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-delegations tbody >tr:nth-child(11)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-delegations tbody >tr:nth-child(13)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-back')

    await click('staking-copy-refresh-clear-button-group .refresh')

    await click('staking-tab-pools')
}

async function test_staking_not_signin_staking_table_rewards() {
    await click('sidebar-menu-staking')
    await click('header-signin-out')
    await input('modal-signin-input-browse-address', '0xa095541186b2e53698244e231274a0754678664d2655d0e233aa3b9a03d21ef4')
    await click('modal-signin-browse-button')

    await click('staking-tab-pools')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-tab-delegations')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-tab-rewards')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-tab-finalizations')
    await click('staking-copy-refresh-clear-button-group .refresh')


    await click('staking-tab-rewards')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-tab-delegations')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-tab-pools')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-tab-finalizations')
    await click('staking-copy-refresh-clear-button-group .refresh')

    await click('staking-tab-pools')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-tab-finalizations')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-tab-delegations')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-tab-rewards')
    await click('staking-copy-refresh-clear-button-group .refresh')


    await click('staking-table-rewards tbody >tr:nth-child(2)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-undelegate')
    await click('modal-signin-close')
    await click('pool-detail-withdraw')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-rewards tbody >tr:nth-child(3)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-undelegate')
    await click('modal-signin-close')
    await click('pool-detail-withdraw')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-rewards tbody >tr:nth-child(4)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-undelegate')
    await click('modal-signin-close')
    await click('pool-detail-withdraw')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-rewards tbody >tr:nth-child(5)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-rewards tbody >tr:nth-child(7)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-undelegate')
    await click('modal-signin-close')
    await click('pool-detail-withdraw')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-rewards tbody >tr:nth-child(1)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-undelegate')
    await click('modal-signin-close')
    await click('pool-detail-withdraw')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-rewards tbody >tr:nth-child(9)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-undelegate')
    await click('modal-signin-close')
    await click('pool-detail-withdraw')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-rewards tbody >tr:nth-child(10)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-undelegate')
    await click('modal-signin-close')
    await click('pool-detail-withdraw')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-rewards tbody >tr:nth-child(11)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-undelegate')
    await click('modal-signin-close')
    await click('pool-detail-withdraw')
    await click('modal-signin-close')
    await click('pool-detail-back')
    await click('staking-table-rewards tbody >tr:nth-child(13)')
    await click('pool-detail-delegate')
    await click('modal-signin-close')
    await click('pool-detail-undelegate')
    await click('modal-signin-close')
    await click('pool-detail-withdraw')
    await click('modal-signin-close')
    await click('pool-detail-back')


    await click('staking-table-rewards tbody >tr:nth-child(2) .withdraw .button')
    await click('staking-table-rewards tbody >tr:nth-child(3) .withdraw .button')
    await click('staking-table-rewards tbody >tr:nth-child(4) .withdraw .button')
    await click('staking-table-rewards tbody >tr:nth-child(5) .withdraw .button')
    await click('staking-table-rewards tbody >tr:nth-child(7) .withdraw .button')
    await click('staking-table-rewards tbody >tr:nth-child(1) .withdraw .button')
    await click('staking-table-rewards tbody >tr:nth-child(9) .withdraw .button')
    await click('staking-table-rewards tbody >tr:nth-child(10) .withdraw .button')
    await click('staking-table-rewards tbody >tr:nth-child(17) .withdraw .button')
    await click('staking-table-rewards tbody >tr:nth-child(13) .withdraw .button')


    await click('staking-table-rewards tbody >tr:nth-child(2) .staking-table-rewards-switch')
    await click('staking-table-rewards tbody >tr:nth-child(3) .staking-table-rewards-switch')
    await click('staking-table-rewards tbody >tr:nth-child(4) .staking-table-rewards-switch')
    await click('staking-table-rewards tbody >tr:nth-child(5) .staking-table-rewards-switch')
    await click('staking-table-rewards tbody >tr:nth-child(7) .staking-table-rewards-switch')
    await click('staking-table-rewards tbody >tr:nth-child(1) .staking-table-rewards-switch')
    await click('staking-table-rewards tbody >tr:nth-child(9) .staking-table-rewards-switch')
    await click('staking-table-rewards tbody >tr:nth-child(10) .staking-table-rewards-switch')
    await click('staking-table-rewards tbody >tr:nth-child(17) .staking-table-rewards-switch')
    await click('staking-table-rewards tbody >tr:nth-child(13) .staking-table-rewards-switch')

    await click('staking-copy-refresh-clear-button-group .clear-address')

    await click('staking-tab-delegations')
    await click('modal-signin-close')
    await click('staking-tab-rewards')
    await click('modal-signin-close')
    await click('staking-tab-finalizations')
    await click('modal-signin-close')
    await click('staking-tab-delegations')
    await click('modal-signin-close')
    await click('staking-tab-rewards')
    await click('modal-signin-close')
    await click('staking-tab-finalizations')
    await click('modal-signin-close')


    await click('staking-table-rewards tbody >tr:nth-child(2) .withdraw .button')
    await click('modal-signin-close')
    await click('staking-table-rewards tbody >tr:nth-child(3) .withdraw .button')
    await click('modal-signin-close')
    await click('staking-table-rewards tbody >tr:nth-child(4) .withdraw .button')
    await click('modal-signin-close')
    await click('staking-table-rewards tbody >tr:nth-child(5) .withdraw .button')
    await click('modal-signin-close')
    await click('staking-table-rewards tbody >tr:nth-child(7) .withdraw .button')
    await click('modal-signin-close')
    await click('staking-table-rewards tbody >tr:nth-child(1) .withdraw .button')
    await click('modal-signin-close')
    await click('staking-table-rewards tbody >tr:nth-child(9) .withdraw .button')
    await click('modal-signin-close')
    await click('staking-table-rewards tbody >tr:nth-child(10) .withdraw .button')
    await click('modal-signin-close')
    await click('staking-table-rewards tbody >tr:nth-child(17) .withdraw .button')
    await click('modal-signin-close')
    await click('staking-table-rewards tbody >tr:nth-child(13) .withdraw .button')
    await click('modal-signin-close')


    await click('staking-table-rewards tbody >tr:nth-child(2) .staking-table-rewards-switch')
    await click('modal-signin-close')
    await click('staking-table-rewards tbody >tr:nth-child(3) .staking-table-rewards-switch')
    await click('modal-signin-close')
    await click('staking-table-rewards tbody >tr:nth-child(4) .staking-table-rewards-switch')
    await click('modal-signin-close')
    await click('staking-table-rewards tbody >tr:nth-child(5) .staking-table-rewards-switch')
    await click('modal-signin-close')
    await click('staking-table-rewards tbody >tr:nth-child(7) .staking-table-rewards-switch')
    await click('modal-signin-close')
    await click('staking-table-rewards tbody >tr:nth-child(1) .staking-table-rewards-switch')
    await click('modal-signin-close')
    await click('staking-table-rewards tbody >tr:nth-child(9) .staking-table-rewards-switch')
    await click('modal-signin-close')
    await click('staking-table-rewards tbody >tr:nth-child(10) .staking-table-rewards-switch')
    await click('modal-signin-close')
    await click('staking-table-rewards tbody >tr:nth-child(17) .staking-table-rewards-switch')
    await click('modal-signin-close')
    await click('staking-table-rewards tbody >tr:nth-child(13) .staking-table-rewards-switch')
    await click('modal-signin-close')

    await click('staking-copy-refresh-clear-button-group .refresh')

    await click('staking-tab-pools')
}


async function test_staking_not_signin_staking_table_finalizations() {
    await click('sidebar-menu-staking')
    await click('header-signin-out')
    await input('modal-signin-input-browse-address', '0xa095541186b2e53698244e231274a0754678664d2655d0e233aa3b9a03d21ef4')
    await click('modal-signin-browse-button')

    await click('staking-tab-pools')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')
    await click('staking-tab-delegations')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')
    await click('staking-tab-rewards')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')
    await click('staking-tab-finalizations')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')


    await click('staking-tab-rewards')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')
    await click('staking-tab-delegations')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')
    await click('staking-tab-pools')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')
    await click('staking-tab-finalizations')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')

    await click('staking-tab-rewards')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')
    await click('staking-tab-pools')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')
    await click('staking-tab-finalizations')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')
    await click('staking-tab-delegations')
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')

    await click('staking-copy-refresh-clear-button-group .clear-address')
    await click('header-signin-out')
    await input('modal-signin-input-browse-address', '0xa095541186b2e53698244e231274a0754678664d2655d0e233aa3b9a03d21ef4')
    await click('modal-signin-browse-button')
    await click('staking-copy-refresh-clear-button-group .clear-address')
    await click('header-signin-out')
    await input('modal-signin-input-browse-address', '0xa095541186b2e53698244e231274a0754678664d2655d0e233aa3b9a03d21ef4')
    await click('modal-signin-browse-button')
    await click('staking-copy-refresh-clear-button-group .clear-address')
    await click('header-signin-out')
    await input('modal-signin-input-browse-address', '0xa095541186b2e53698244e231274a0754678664d2655d0e233aa3b9a03d21ef4')
    await click('modal-signin-browse-button')
    await click('staking-copy-refresh-clear-button-group .clear-address')
    await click('header-signin-out')
    await input('modal-signin-input-browse-address', '0xa095541186b2e53698244e231274a0754678664d2655d0e233aa3b9a03d21ef4')
    await click('modal-signin-browse-button')
    await click('staking-copy-refresh-clear-button-group .clear-address')
    await click('header-signin-out')
    await input('modal-signin-input-browse-address', '0xa095541186b2e53698244e231274a0754678664d2655d0e233aa3b9a03d21ef4')
    await click('modal-signin-browse-button')
}


async function signin_private_key() {
    await await signin_with_header_button('private_key', 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff76a1592044a6e4f511265bca73a604d90b0529d1df602be30a19a9257660d1f5')
}

async function signin_visitor() {
    await signin_with_header_button('visitor', '0xa095541186b2e53698244e231274a0754678664d2655d0e233aa3b9a03d21ef4')
}
async function switch_tab_pool() {
    await click('staking-tab-pools')
}

async function switch_tab_delegation() {
    await click('staking-tab-delegations')
}

async function switch_tab_rewards() {
    await click('staking-tab-rewards')
}
async function switch_tab_finalization() {
    await click('staking-tab-finalizations')
}

async function get_balance(){
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

async function get_transaction_result() {
    const error = await ele_can_click('modal_transaction_error-close')
    if(error) {
        await click('modal_transaction_error-close')
        return 0
    }
    let button = await ele_can_click('modal-transaction-success-back')
    let count = 10
    while((!button) && (count > 0)) {
        button = await ele_can_click('modal-transaction-success-back')
        driver.sleep(3000)
    }
    if(!button) throw 'transaction fail'
    return button
}
