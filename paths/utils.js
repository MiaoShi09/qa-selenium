global.skip_to_pool_detail = async function(){
    const url = `https://localhost:3000/pool/${ pool_detail_suffixs[get_num_from_0_to_less_n(pool_detail_suffixs.length)] }`
    log.info('goto pool detail:', url)
    await executeScript(`window.location = '${url}'`)
}



global.skip_to_console = async function() {
    log.info('navigate to staking console page');
    return driver.navigate().to(`${ TEST_CONFIG.domain[TEST_CONFIG.current_target] }/staking/console`)
}


global.skip_to_staking = async function(tab_name) {
    const url = `${ TEST_CONFIG.domain[TEST_CONFIG.current_target] }/staking/${tab_name}`
    log.info('navigate to staking section:', url)
    return driver.navigate().to(url);
}


global.skip_to_help_page = async function(help_name) {
    const url = `${ TEST_CONFIG.domain[TEST_CONFIG.current_target] }/dashboard/${help_name}`
    log.info('skip to dashboard:', url)
    return driver.navigate().to(url);
}


global.skip_to_menu_item = async function(menu_item_name) {
	const url = `${ TEST_CONFIG.domain[TEST_CONFIG.current_target] }/${menu_item_name}`
    log.info('skip to menu_item:', url)
    return driver.navigate().to(url);
}