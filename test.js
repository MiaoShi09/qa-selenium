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

const test = async function(){
    await start()

    //await test_dashboard_no_address()
    //await test_dashboard_visitor()
    //await test_dashboard_private_key()

    //await test_account_no_address()
    //await test_account_visitor()
    //await test_account_private_key()

    //await test_staking_no_address()
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

    await test_modal_sign()

    return true
}


test().then(res => {
    console.log('test success:', res)
}).catch(err => {
    console.error('test fail:', err)
})
