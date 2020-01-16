const { start } = require('./utils/index')
const { test_dashboard_no_address,
    test_dashboard_visitor,
    test_dashboard_private_key } = require('./test_dashboard')


const { test_account_no_address,
    test_account_visitor,
    test_account_private_key } = require('./test_account')

const { test_staking_no_address,
    test_staking_visitor,
    test_staking_private_key,
    test_staking_delegate,
    test_staking_undelegate,
    test_staking_transfer,
    test_staking_auto_delegation_rewards,
    test_staking_withdraw } = require('./test_staking')

const {
    test_paths_no_address,
    test_paths_visitor,
    test_paths_private_key
} = require('./test_paths')

const { test_modal_sign } = require('./test_modal_signin')


/*global.global_private_key = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff76a1592044a6e4f511265bca73a604d90b0529d1df602be30a19a9257660d1f5'
global.global_visitor_address = '0xa095541186b2e53698244e231274a0754678664d2655d0e233aa3b9a03d21ef4'*/


global.global_private_key = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff11ff8d4e72fddd7c426adb4a5aeebb98b8a4752c4a9048f65537789a810348573b'
global.global_visitor_address = '0xa038ea9a946679d2a293b208898679a67cc1d4eb071d0fbe8d151c315ccc2c58'

const test = async function(){
    await start()

    //await test_dashboard_no_address()
    //await test_dashboard_visitor()
    //await test_dashboard_private_key()

    //await test_account_no_address()
    //await test_account_visitor()
    //await test_account_private_key()

    await test_staking_no_address()
    //await test_staking_visitor()
    //await test_staking_private_key()
    //await test_staking_delegate()
    //await test_staking_undelegate()
    //await test_staking_transfer()
    //await test_staking_auto_delegation_rewards()
    //await test_staking_withdraw()

    //await test_paths_no_address()
    //await test_paths_visitor()
    //await test_paths_private_key()

    //await test_modal_sign()

    return true
}


test().then(res => {
    console.log('test success:', res)
}).catch(err => {
    console.error('test fail:', err)
})
