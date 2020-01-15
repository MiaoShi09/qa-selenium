const { switch_tab_rewards, get_balance } = require('./utils')


exports.test_staking_withdraw = async function() {
    await goto_staking()
    await signin_private_key()
    const balance = await get_balance()
    if(balance <= 0) return
    const times = 3
    await switch_tab_rewards()
    const len = await get_delegations_len()
    if(!len) console.warn('no delegations')
    for (let i = 0;i < times; i++) {
        await delegation_table_button_withdraw(len, (i === (times - 1)) ? false : true)
    }

    for (let i = 0;i < times; i++) {
        await random_withdraw_from_console_pool_list((i === (times - 1)) ? true : false)
    }

    for (let i = 0;i < times; i++) {
        await random_table_row_withdraw(len)
    }
}

async function delegation_table_button_withdraw(len, back = true){
    await click_table_single_button('staking-table-rewards', get_num_from_1_to_n(len), '.withdraw .button')
    const console_back = await console_back_visible()
    if(!console_back) return
    await pop_submit_button()
    await submit_transaction()
    await close_transaction_success_modal()
    if(back) await console_go_back()
}

async function random_withdraw_from_console_pool_list(back = false){
    await random_select_from_console_pool_list()
    await pop_submit_button()
    await submit_transaction()
    await close_transaction_success_modal()
    if(back) await console_go_back()
}


async function random_table_row_withdraw(len, back = true) {
    await click_table_row('staking-table-rewards', get_num_from_1_to_n(len))
    const go_head = await pool_detail_withdraw_button()
    if(!go_head) {
        await pool_detail_go_back()
        return
    }
    const console_go_back_button = console_back_visible()
    if(!console_go_back_button) return
    await pop_submit_button()
    await submit_transaction()
    await close_transaction_success_modal()
    if(!back) return
    await console_go_back()
    await pool_detail_go_back()
}
