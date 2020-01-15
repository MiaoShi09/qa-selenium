const {
    switch_tabs_visitor,
    switch_tab_pool,
    switch_tab_finalization,
    switch_tab_rewards,
    switch_tab_delegation,
    get_balance,
    switch_tabs_private_key } = require('./utils')



exports.test_staking_private_key = async function() {
    await goto_staking()
    await signin_private_key()
    const balance = await get_balance()
    if(balance <= 0) return
    //await switch_tabs_private_key()
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
    await click('staking-copy-refresh-clear-button-group .copy')
    await signout_from_staking()
}
