const { switch_tab_delegation, get_balance } = require('./utils')

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
        await delegation_table_button_undelegate(len, (i === (times - 1)) ? false : true)
    }
    for(let i = 0;i < times;i++) {
        await random_undelegate_from_console_pool_list((i === (times - 1)) ? true : false)
    }
    for(let i = 0;i < times;i++) {
        await random_table_row_undelegate(len, (i === (times - 1)) ? false : true)
    }
}

async function delegation_table_button_undelegate(len, back = true){
    await click_table_single_button('staking-table-delegations', get_num_from_1_to_n(len), '.staking-table-delegations-td-buttons .undelegate')
    const console_back = await console_back_visible()
    if(!console_back) return
    await input_console(0.3)
    await pop_submit_button()
    await submit_transaction()
    await close_transaction_success_modal()
    if(back) await console_go_back()
}

async function random_undelegate_from_console_pool_list(back = false){
    await random_select_from_console_pool_list()
    await input_console(0.3)
    await pop_submit_button()
    await submit_transaction()
    await close_transaction_success_modal()
    if(back) await console_go_back()
}

async function random_table_row_undelegate(len, back = true) {
    await click_table_row('staking-table-delegations', get_num_from_1_to_n(len))
    const balance = await get_balance()
    if(balance < 3) return
    const go_head = await pool_detail_undelegate_button()
    if(!go_head) {
        await pool_detail_go_back()
        return
    }
    const console_go_back_button = console_back_visible()
    if(!console_go_back_button) return
    const rand = get_num_from_0_to_less_n(2)
    if(rand === 1) {
        await input_console(0.3)
    } else await click_console_top_full_amount()
    await pop_submit_button()
    await submit_transaction()
    await close_transaction_success_modal()
    if(!back) return
    await console_go_back()
    await pool_detail_go_back()
}
