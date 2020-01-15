const { get_balance } = require('./utils')

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
        await random_table_row_delegate((i === (times - 1)) ? false: true)
    }

    for(let i = 0;i < times;i++) {
        await random_select_pool_delegate()
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
    await close_transaction_success_modal()
    if(back) await console_go_back()
}

async function random_table_row_delegate(back = true){
    const len = await executeScript('return getState().pools.length')
    await click_table_row('staking-table-pools', get_num_from_1_to_n(len))
    const balance = await get_balance()
    if(balance < 3) return
    const go_head = await pool_detail_delegate_button()
    if(!go_head) {
        await pool_detail_go_back()
        return
    }
    const console_go_back_button = console_back_visible()
    if(!console_go_back_button) return
    await input_console(0.3)
    await pop_submit_button()
    await submit_transaction()
    await close_transaction_success_modal()
    if(!back) return
    await console_go_back()
    await pool_detail_go_back()
}

async function random_select_pool_delegate(){
    await random_select_from_console_pool_list()
    await input_console(0.3)
    await pop_submit_button()
    await submit_transaction()
    await close_transaction_success_modal()
}
