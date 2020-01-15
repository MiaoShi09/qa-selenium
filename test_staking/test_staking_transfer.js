const { get_balance, switch_tab_delegation } = require('./utils')



exports.test_staking_transfer = async function() {
    await goto_staking()
    await signin_private_key()
    const balance = await get_balance()
    if(balance <= 0) return
    const times = 3
    await switch_tab_delegation()
    const len = await get_delegations_len()
    if(!len) console.warn('no delegations')
    for(let i = 0;i < times;i++) {
        await delegation_table_button_transfer(len, (i === (times - 1)) ? false : true)
    }
    for(let i = 0;i < times;i++) {
        await random_transfer_from_console_pool_list((i === (times - 1)) ? true : false)
    }
}

async function delegation_table_button_transfer(len, back){
    await click_table_single_button('staking-table-delegations', get_num_from_1_to_n(len), '.staking-table-delegations-td-buttons .transfer')
    const console_back = await console_back_visible()
    if(!console_back) return
    await input_console(0.3)
    await pop_submit_button()
    await submit_transaction()
    await close_transaction_success_modal()
    if(back) await console_go_back()
}

async function random_transfer_from_console_pool_list(back = false){
    await random_select_from_console_pool_list()
    await random_select_from_console_to_pool_list()
    await input_console(0.3)
    await pop_submit_button()
    await submit_transaction()
    await close_transaction_success_modal()
    if(back) await console_go_back()
}
