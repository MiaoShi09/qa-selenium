const {
    switch_tabs_visitor,
    switch_tab_pool,
    switch_tab_finalization,
    switch_tab_rewards,
    switch_tab_delegation,
    get_balance,
    switch_tabs_private_key,
    switch_tab_commission_rate_changes,
    get_commission_rate_changes_len,
    open_register_modal,
    close_register_modal
} = require('./utils')

const pool_edit_operation_arr = [
    [input_modal_pool_meta_data, submit_meta_data_hash_change],
    [input_modal_pool_commission_rate, submit_commission_rate_change],
    [input_modal_pool_meta_data_url, 0],
    [input_modal_pool_address, submit_address_edit],
    [open_verify_json_site, 0]
]

exports.test_staking_private_key = async function() {
   await goto_staking()
   /*await signin_private_key()
   const balance = await get_balance()
   if(balance <= 0) return
   await switch_tabs_private_key()
   await switch_tab_pool()
   await click_table_rows('', 'staking-table-pools', 'pools', click_pool_detail_buttons_private_key, 5)
   await test_table_headers('', 'staking-table-pools',
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
   await test_table_headers('', 'staking-tab-delegations',
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

   await test_table_headers('', 'staking-table-rewards',
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


   await test_table_headers('', 'staking-table-finalizations',
       ['staking-table-finalizations-amount'])
   await click('staking-copy-refresh-clear-button-group .refresh')
   await click('staking-copy-refresh-clear-button-group .copy')*/


    await switch_tab_commission_rate_changes()
    await switch_tabs_visitor()
    await signin_private_key()
    await switch_tab_commission_rate_changes()

    const commission_rate_changes_len = await get_commission_rate_changes_len()


    for(let i = 0;i < 6;i++) {
        await click_table_single_button('commission_rate_changes', get_num_from_1_to_n(commission_rate_changes_len), '.button')
        await submit_transaction()
        await close_transaction_success_modal()
    }

    await open_register_modal()
    await close_register_modal()
    await open_register_modal()
    await close_register_modal()
    await open_register_modal()
    await close_register_modal()
    await open_register_modal()
    await close_register_modal()
    await open_register_modal()
    await close_register_modal()

    if(await pool_is_edit_mode()) {
        console.log('pool is edit mode===================================================================================')
        if(!commission_rate_changes_len) return
        await open_register_modal()
        const times = 8
        for(let i = 0;i < times; i++) {
            const op = pool_edit_operation_arr[get_num_from_0_to_less_n(pool_edit_operation_arr.length)]
            await op[0]()
            if(op[1]) {
                await op[1]()
                await close_transaction_success_modal()
                await open_register_modal()
            }
        }

        await close_register_modal()
        await open_register_modal()
        await close_register_modal()
        await open_register_modal()
        await close_register_modal()
        await open_register_modal()

        for(let i = 0;i < times; i++) {
            const op = pool_edit_operation_arr[get_num_from_0_to_less_n(pool_edit_operation_arr.length)]
            await op[0]()
            if(op[1]) {
                await op[1]()
                await close_transaction_success_modal()
                await open_register_modal()
            }
        }

    } else {
        console.log('is pool registry mode=========================================================================')
        await submit_registry_pool()
        await submit_registry_pool()
        await submit_registry_pool()
        await submit_registry_pool()
        await submit_registry_pool()

        await open_register_modal()
        await submit_registry_pool()
        await input_modal_pool_address(global_visitor_address)
        await submit_registry_pool()
        await input_modal_pool_meta_data_url()
        await submit_registry_pool()
        await input_modal_pool_meta_data()
        await submit_registry_pool()
        await close_transaction_success_modal()
        let ele = await ele_can_click('modal-pool-close')
        if(ele) return
        await input_modal_pool_commission_rate()
        await submit_registry_pool()
        await close_transaction_success_modal()
        ele = await ele_can_click('modal-pool-close')
        if(ele) return
        await input_init_stake()
        await submit_registry_pool()
        await close_transaction_success_modal()
    }

    await close_register_modal()
    await signout_from_staking()
}



async function get_random_address(){
    const address = await get_address()
    return address.substring(0, address.length - 1) + get_num_from_0_to_less_n(10)
}

async function pool_is_edit_mode(){
    let pools = JSON.parse(await executeScript('return JSON.stringify(getState().pools)'))
    let count = 10
    while((!(pools.length))) {
        pools = JSON.parse(await executeScript('return JSON.stringify(getState().pools)'))
        count--
        await driver.sleep(500)
    }

    if(!(pools.length)) return

    const address = await get_address()

    return pools.find(v => v.address === address)
}

async function input_modal_pool_address(address){
    await input('modal-pool-address', address || await get_random_address())
}

async function input_modal_pool_meta_data_url(){
    await input('modal-pool-meta_data_url', `rfegwergfwert34256t234${get_num_from_0_to_less_n(1000)}`)
}

async function input_modal_pool_meta_data() {
    await input('modal-pool-meta_data_json', `{"version":"${get_num_from_0_to_less_n(1000)}","name":"${get_num_from_0_to_less_n(1000)}",
    "logo":"${get_num_from_1_to_n(1000)}"}`)
}

async function input_modal_pool_commission_rate() {
    await input('modal-pool-commission_rate', get_num_from_1_to_n(1000))
}

async function submit_address_edit(){
    await click('modal-pool-submit-address-edit')
}

async function submit_meta_data_hash_change() {
    await click('modal-pool-submit-meta_data_hash')
}


async function submit_commission_rate_change() {
    await click('modal-pool-submit-commission-change')
}

async function open_verify_json_site() {
    await click('modal-pool-verify-json')
}


async function input_init_stake(){
    await input('modal-pool-init-stake', get_num_from_1_to_n(5000))
}


async function submit_registry_pool() {
    await click('modal-pool-registry')
}

