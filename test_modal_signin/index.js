exports.test_modal_sign = async function(){
    await click('header-signin-out')
    await click('modal-signin-close')
    await click('header-signin-out')

    // ledger
    await click('modal-signin-ledger-button')
    await click('modal-signin-ledger-back')
    await click('modal-signin-ledger-button')
    await click('modal-signin-ledger-close')
    await click('header-signin-out')
    await click('modal-signin-ledger-button')
    await click('modal-signin-ledger-signin')
    await click('modal-signin-ledger-back')

    // keystore
    await click('modal-signin-keystore-file-button')
    await click('modal-signin-keystore-back')
    await click('modal-signin-keystore-file-button')
    await click('modal-signin-keystore-close')
    await click('header-signin-out')
    await click('modal-signin-keystore-file-button')
    await click('modal-signin-keystore-continue')
    await click('modal-signin-keystore-back')

    // private key
    await click('modal-signin-private-key-button')
    await click('modal-signin-private-key-back')
    await click('modal-signin-private-key-button')
    await click('modal-signin-private-key-close')
    await click('header-signin-out')
    await click('modal-signin-private-key-button')
    await click('modal-signin-private-key-back')

    // mnemonic
    await click('modal-signin-mnemonic-phrase-button')
    await click('modal-signin-mnemonic-back')
    await click('modal-signin-mnemonic-phrase-button')
    await click('modal-signin-mnemonic-close')
    await click('header-signin-out')
    await click('modal-signin-mnemonic-phrase-button')
    await click('modal-signin-mnemonic-signin')
    await click('modal-signin-mnemonic-back')

    // browse
    await input('modal-signin-input-browse-address', '0xa095541186b2e53698244e231274a0754678664d2655d0e233aa3b9a03d21ef4')
    await click('modal-signin-browse-button')

    await click('header-signin-out')

    // private
    await click('modal-signin-private-key-button')
    await input('modal-signin-private-key-input', 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff76a1592044a6e4f511265bca73a604d90b0529d1df602be30a19a9257660d1f5')
    await click('modal-signin-private-key-signin')

    await click('header-signin-out')
}
