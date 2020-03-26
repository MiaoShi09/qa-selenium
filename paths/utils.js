global.skip_to_pool_detail = async function(){
    const url = `https://localhost:3000/pool/${ pool_detail_suffixs[get_num_from_0_to_less_n(pool_detail_suffixs.length)] }`
    log.info('goto pool detail:', url)
    await executeScript(`window.location = '${url}'`)
}



global.skip_to_console = async function() {
    log.info('navigate to staking console page');
    await driver.navigate().to(`${ TEST_CONFIG.domain[TEST_CONFIG.current_target] }/staking/console`);
    return driver.sleep(TEST_CONFIG.wait_time);
}


global.skip_to_pool_detail = async function(pool_addr) {
    let url = `${ TEST_CONFIG.domain[TEST_CONFIG.current_target] }/pool/${pool_addr}`
    log.info('navigate to pool detail section:', url)
    await driver.navigate().to(url);
    return driver.sleep(TEST_CONFIG.wait_time);
}


global.skip_to_help_page = async function(help_name) {
    let url = `${ TEST_CONFIG.domain[TEST_CONFIG.current_target] }/dashboard/help/${help_name}`
    log.info('skip to dashboard:', url)
    await driver.navigate().to(url);
    return driver.sleep(TEST_CONFIG.wait_time);
}


global.skip_to_menu_item = async function(menu_item_name) {
	let url = `${ TEST_CONFIG.domain[TEST_CONFIG.current_target] }/${menu_item_name}`
    log.info('skip to menu_item:', url)
    await driver.navigate().to(url);
    return driver.sleep(TEST_CONFIG.wait_time);
}


global.skip_to_staking_tab = async function(tab_name){
    let url = `${ TEST_CONFIG.domain[TEST_CONFIG.current_target] }/staking/${tab_name}`
    log.info('navigate to staking section:', url)
    await driver.navigate().to(url);
    return driver.sleep(TEST_CONFIG.wait_time);
}