const skip_fun_arr = [skip_to_pool_detail, skip_to_console, skip_to_staking, skip_to_dashboard, skip_to_account]


exports.test_paths_no_address = async function (how_many = 40) {
    for(let i = 0;i < how_many;i++) {
        await (skip_fun_arr[get_num_from_0_to_less_n(skip_fun_arr.length)]())
    }
}


exports.test_paths_visitor = async function (how_many = 40) {
    await signin_visitor()
    for(let i = 0;i < how_many;i++) {
        await (skip_fun_arr[get_num_from_0_to_less_n(skip_fun_arr.length)]())
    }
    await signout_from_staking()
}


exports.test_paths_private_key = async function (how_many = 40) {
    await signin_private_key()
    for(let i = 0;i < how_many;i++) {
        await (skip_fun_arr[get_num_from_0_to_less_n(skip_fun_arr.length)]())
    }
    await signout_from_account()
}
