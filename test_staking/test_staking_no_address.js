const { switch_tabs_no_address, switch_tab_delegation, switch_tab_rewards,switch_tab_finalization } = require('./utils')

exports.test_staking_no_address = async function() {
    await goto_staking()
    await switch_tabs_no_address()
    await click_table_rows('sidebar-menu-staking', 'staking-table-pools', 'pools', click_pool_detail_buttons_not_signin, 5)
    await click_table_buttons('sidebar-menu-staking', 'staking-table-pools', 'pools', ['button'], async () => {
        await click('modal-signin-close')
    }, 10)
    await test_table_headers('sidebar-menu-staking', 'staking-table-pools',
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
    await test_table_headers('', 'staking-tab-delegations',
        ['staking-pool', 'status', 'my-delegation', 'rewards', 'fees', 'performance'].map(v => `staking-table-delegations-${v}`))
    await click_table_buttons('', 'staking-tab-delegations', 'delegations', ['staking-table-delegations-td-buttons .undelegate', 'staking-table-delegations-td-buttons .transfer'], async () => {
        await click('modal-signin-close')
    }, 10)
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')
    await click(`staking-table-delegations tbody:nth-child(1)`)
    await click_pool_detail_buttons_not_signin()

    await signin_visitor()
    await signout_from_header_button()
    await signin_private_key()
    await signout_from_header_button()
    await signin_visitor()


    await switch_tab_rewards()
    await click('staking-copy-refresh-clear-button-group .clear-address')
    await switch_tabs_no_address(1)
    await test_table_headers('', 'staking-table-rewards',
        ['staking-pool', 'status', 'my-delegation', 'rewards', 'fees', 'performance'].map(v => `staking-table-rewards-${v}`))
    await click_table_buttons('', 'staking-table-rewards', 'delegations', ['staking-table-rewards-switch', 'withdraw .button'], async () => {
        await click('modal-signin-close')
    }, 10)
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')
    await click(`staking-table-delegations tbody:nth-child(2)`)
    await click_pool_detail_buttons_not_signin()

    await signin_visitor()
    await signout_from_header_button()
    await signin_private_key()
    await signout_from_header_button()
    await signin_visitor()

    await switch_tab_finalization()
    await click('staking-copy-refresh-clear-button-group .clear-address')
    await switch_tabs_no_address(1)
    await test_table_headers('', 'staking-table-finalizations',
        ['staking-table-finalizations-amount'])
    await click('staking-copy-refresh-clear-button-group .refresh')
    await click('staking-copy-refresh-clear-button-group .copy')
    await signout_from_header_button()
}
