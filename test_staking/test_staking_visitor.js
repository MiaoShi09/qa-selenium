const { switch_tabs_visitor,
    switch_tab_pool,
    switch_tab_finalization,
    switch_tab_rewards,
    switch_tab_delegation,
    switch_tab_commission_rate_changes,
    open_register_modal,
    get_commission_rate_changes_len
} = require('./utils')

exports.test_staking_visitor = async function() {
    await goto_staking()
    await signin_visitor()
    await switch_tabs_visitor()
    await switch_tab_pool()
    await click_table_rows('', 'staking-table-pools', 'pools', click_pool_detail_buttons_not_signin, 5)
    await click_table_buttons('', 'staking-table-pools', 'pools', ['button'], async () => 0, 10)
    await test_table_headers('', 'staking-table-pools',
        ['staking-pool', 'status', 'total-staked', 'self-bond', 'capacity', 'stake-weight', 'fees', 'performance'].map(v => `staking-table-pools-th-${v}`))
    await test_menus()
    await goto_staking()

    await signout_from_header_button()
    await signin_private_key()
    await signout_from_header_button()
    await signin_visitor()

    await switch_tabs_visitor()
    await switch_tab_delegation()
    await test_table_headers('', 'staking-tab-delegations',
        ['staking-pool', 'status', 'my-delegation', 'rewards', 'fees', 'performance'].map(v => `staking-table-delegations-${v}`))
    await click_table_buttons('', 'staking-tab-delegations', 'delegations', ['staking-table-delegations-td-buttons .undelegate', 'staking-table-delegations-td-buttons .transfer'], async () => 0, 10)
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')
    await click_table_rows('', 'staking-tab-delegations', 'delegations', click_pool_detail_buttons_not_signin, 5)

    await switch_tab_rewards()
    await switch_tabs_visitor()
    await switch_tab_rewards()

    await test_table_headers('', 'staking-table-rewards',
        ['staking-pool', 'status', 'my-delegation', 'rewards', 'fees', 'performance'].map(v => `staking-table-rewards-${v}`))
    await click_table_buttons('', 'staking-table-rewards', 'delegations', ['staking-table-rewards-switch', 'withdraw .button'], async () => 0, 10)
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

    await switch_tab_commission_rate_changes()
    await switch_tabs_visitor()
    await switch_tab_commission_rate_changes()

    await open_register_modal()
    const commisstion_rate_changes_len = get_commission_rate_changes_len()
    for(let i = 0;i < 20;i++) await click_table_single_button('commission_rate_changes', get_num_from_1_to_n(commisstion_rate_changes_len), '.button')
    await signout_from_staking()
}
