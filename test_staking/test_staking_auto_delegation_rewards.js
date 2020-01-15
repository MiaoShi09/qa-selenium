const { get_balance, switch_tab_rewards } = require('./utils')



exports.test_staking_auto_delegation_rewards = async function() {
    await goto_staking()
    await signin_private_key()
    const balance = await get_balance()
    if(balance <= 0) return
    const times = 8
    await switch_tab_rewards()
    const len = await get_delegations_len()
    if(!len) console.warn('no delegations')
    for(let i = 0;i < times;i++) {
        await random_click_auto_delegation_rewards_button(len)
    }
}

async function random_click_auto_delegation_rewards_button(len){
    await click_table_single_button('staking-table-rewards', get_num_from_1_to_n(len), '.staking-table-rewards-switch')
    await submit_transaction()
    await close_transaction_success_modal()
}
