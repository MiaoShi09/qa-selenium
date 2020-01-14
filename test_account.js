exports.test_account_no_address= async function() {
    await goto_account()
    await signin_from_account_page_visitor()
    await signout_from_staking()
    await signin_from_account_page_visitor()
    await signout_from_account()
}

exports.test_account_visitor = async function(click) {
    await goto_account()
    await signin_from_account_page_visitor()
    await click_buttons()
    await click_tabs()
    await switch_to_balance()
    await click_buttons()
    await switch_to_transaction()
    await sort_table()
    await random_scroll()
    await click_clear_or_copy_refreshs_visitor()
    await signin_from_account_page_visitor()
    await switch_to_balance()
    await click_buttons()
    await goto_account()
    await signout_from_account()

    await goto_account()
    await signin_from_account_page_visitor()
    await click_buttons()
    await click_tabs()
    await switch_to_balance()
    await click_buttons()
    await switch_to_transaction()
    await sort_table()
    await random_scroll()
    await click_clear_or_copy_refreshs_visitor()
    await signin_from_account_page_visitor()
    await switch_to_balance()
    await click_buttons()
    await signout_from_staking()



}

exports.test_account_private_key = async function() {
    await goto_account()
    await signin_from_account_page_private_key()
    await switch_to_balance()
    await click_buttons()
    await click_tabs()
    await click_clear_or_copy_refreshs_private_key()
    await switch_to_transaction()
    await sort_table()
    await random_scroll()
    await signout_from_account()

    await goto_account()
    await signin_from_account_page_private_key()
    await switch_to_balance()
    await click_buttons()
    await click_clear_or_copy_refreshs_private_key()
    await click_tabs()
    await switch_to_transaction()
    await sort_table()
    await random_scroll()
    await signout_from_staking()

    await goto_account()
    await signin_from_account_page_private_key()
    await switch_to_balance()
    await click_buttons()
    await click_clear_or_copy_refreshs_private_key()
    await click_tabs()
    await switch_to_transaction()
    await sort_table()
    await random_scroll()
    await signout_from_header_button()

    await goto_account()
    await signin_from_account_page_private_key()
    await switch_to_balance()
    await click_buttons()
    await click_clear_or_copy_refreshs_private_key()
    await click_tabs()
    await switch_to_transaction()
    await sort_table()
    await random_scroll()
    await signout_from_header_button()

}

async function signin_from_account_page_visitor(){
    const type = await executeScript('return getState().account.type')
    if(type) return
    await click('modal-unsignined-signin')
    await input('modal-signin-input-browse-address', '0xa095541186b2e53698244e231274a0754678664d2655d0e233aa3b9a03d21ef4')
    await click('modal-signin-browse-button')
}

async function signin_from_account_page_private_key(){
    const type = await executeScript('return getState().account.type')
    if(type) return
    await click('modal-unsignined-signin')
    await click('modal-signin-private-key-button')
    await input('modal-signin-private-key-input', 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff76a1592044a6e4f511265bca73a604d90b0529d1df602be30a19a9257660d1f5')
    await click('modal-signin-private-key-signin')
}

const tabs = ['account-tab-balance', 'account-tab-transaction']

async function click_tabs(){
    for(let i = 0;i < 20;i++) await click(tabs[get_num_from_0_to_less_n(2)])
}

async function switch_to_balance() {
    await click('account-tab-balance')
}

async function switch_to_transaction() {
    await click('account-tab-transaction')
}

const buttons = ['account-current-undelegating-tooltip', 'account-delegate', 'account-undelegate', 'account-withdraw']

async function click_buttons() {
    for(let i = 0;i < 30;i++) {
        await click(buttons[get_num_from_0_to_less_n(4)])
        const ele = await ele_can_click('account-delegate')
        if(!ele) await goto_account()

    }
}

const arr = ['.clear-address', '.copy', '.refresh']

async function click_clear_or_copy_refresh() {
    await click('account-copy-refresh-clear-button-group ' + arr[get_num_from_0_to_less_n(3)])
}

async function sort_table() {
    for(let i = 0;i < 18;i++)await click('account-table-balance-td-amount')
}

async function random_scroll() {
    for(let i = 0;i < 50;i++) await executeScript(`window.scrollTo(0, ${get_num_from_1_to_n(30000)})`)
}

async function click_clear_or_copy_refreshs_visitor() {
    for(let i = 0;i < 30;i++) {
        await click_clear_or_copy_refresh()
        await signin_from_account_page_visitor()
    }
}

async function click_clear_or_copy_refreshs_private_key() {
    for(let i = 0;i < 30;i++) {
        await click(tabs[get_num_from_0_to_less_n(2)])
        await click_clear_or_copy_refresh()
        await signin_from_account_page_private_key()
    }
}
