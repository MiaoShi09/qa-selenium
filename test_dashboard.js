const buttons = ['dashboard-delegate', 'dashboard-withdraw']

const urls = ['dashboard-get-started', 'sidebar-contact-us', 'sidebar-docs']
exports.test_dashboard_no_address = async function() {
    await goto_dashboard()
    await click(urls[0])
    await close_or_open_modal_sign()
    await click(urls[1])
    await click(urls[2])
    await click(urls[0])
    await close_or_open_modal_sign()
    await click(urls[1])
    await click(urls[2])
    await close_or_open_modal_sign()
    await close_or_open_modal_sign()
    await close_or_open_modal_sign()
    await close_or_open_modal_sign()
    await test_buttons_visitor()
    await test_menus()
    await goto_dashboard()
    await goto_dashboard()
    await close_or_open_modal_sign()
    await close_or_open_modal_sign()
    await close_or_open_modal_sign()
    await close_or_open_modal_sign()
    await test_buttons_visitor()
}


exports.test_dashboard_visitor = async function() {
    await signin_with_header_button('visitor', '0xa095541186b2e53698244e231274a0754678664d2655d0e233aa3b9a03d21ef4')
    await goto_dashboard()
    await test_buttons_visitor()
    await test_help_items()
    await test_menus()
    await goto_dashboard()
    await test_buttons_visitor()
    await test_help_items()
    await signout_from_account()

    await signin_with_header_button('visitor', '0xa095541186b2e53698244e231274a0754678664d2655d0e233aa3b9a03d21ef4')
    await goto_dashboard()
    await test_buttons_visitor()
    await test_help_items()
    await test_menus()
    await goto_dashboard()
    await test_buttons_visitor()
    await test_help_items()
    await signout_from_staking()

    await signin_with_header_button('visitor', '0xa095541186b2e53698244e231274a0754678664d2655d0e233aa3b9a03d21ef4')
    await goto_dashboard()
    await test_buttons_visitor()
    await test_help_items()
    await test_menus()
    await goto_dashboard()
    await test_buttons_visitor()
    await test_help_items()
}


exports.test_dashboard_private = async function(){
    await signin_with_header_button('private_key', 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff76a1592044a6e4f511265bca73a604d90b0529d1df602be30a19a9257660d1f5')
    await goto_dashboard()
    await test_buttons_private_key()
    await test_help_items()
    await test_menus()
    await goto_dashboard()
    await test_buttons_private_key()
    await test_help_items()
    await signout_from_account()

    await signin_with_header_button('visiprivate_keytor', 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff76a1592044a6e4f511265bca73a604d90b0529d1df602be30a19a9257660d1f5')
    await goto_dashboard()
    await test_buttons_private_key()
    await test_help_items()
    await test_menus()
    await goto_dashboard()
    await test_buttons_private_key()
    await test_help_items()
    await signout_from_staking()

    await signin_with_header_button('private_key', 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff76a1592044a6e4f511265bca73a604d90b0529d1df602be30a19a9257660d1f5')
    await goto_dashboard()
    await test_buttons_private_key()
    await test_help_items()
    await test_menus()
    await goto_dashboard()
    await test_buttons_private_key()
    await test_help_items()
    await signout_from_header_button()

    await signin_with_header_button('private_key', 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff76a1592044a6e4f511265bca73a604d90b0529d1df602be30a19a9257660d1f5')
    await goto_dashboard()
    await test_buttons_private_key()
    await test_help_items()
    await test_menus()
    await goto_dashboard()
    await test_buttons_private_key()
    await test_help_items()
    await signout_from_header_button()
}


const test_help_items = async function(){
    for(let i = 0;i < 30;i++) {
        await click(`dashboard-help-item-container >.help-item:nth-child(${get_num_from_1_to_n(3)}) > .button`)
        await click('help-detail-back')
    }
}


const test_buttons_visitor = async function(){
    for(let i = 0;i < 30;i++) await click(buttons[get_num_from_0_to_less_n(2)])
}

const test_buttons_private_key = async function(){
    for(let i = 0;i < 30;i++) {
        await click(buttons[get_num_from_0_to_less_n(2)])
        await goto_dashboard()
    }
}
