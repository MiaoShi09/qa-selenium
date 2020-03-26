global.get_table_len = async function(data_name) {
    let count = 5
    let pool_len = await executeScript(`return getState()['${data_name}'].length`)
    while((pool_len === 0) && (count > 0)) {
        pool_len = await executeScript(script)
        count--
        await driver.sleep(1000)
    }
    log.info(`get data ${data_name}  length:`, pool_len)
    return pool_len
}


global.click_table_row = async function (table, seq, call_back = async () => 0) {
    log.info('click table row:', `${table} tbody>tr:nth-child(${seq})`)
    await click(`${table} tbody>tr:nth-child(${seq})`)
    await call_back()
}

global.click_table_single_button = async function(table, seq, button) {
    log.info('click single table button:', `${table} tbody>tr:nth-child(${seq}) ${button}`)
    await click(`${table} tbody>tr:nth-child(${seq}) ${button}`)
}

global.click_table_single_header = async function(table, selector) {
    log.info('click table signle header:', `${table} thead  ${['.', '#'].indexOf(selector) > -1 ? selector : ('#' + selector)}`)
    await click(`${table} thead  ${['.', '#'].indexOf(selector) > -1 ? selector : ('#' + selector)}`)
}

global.click_table_rows = async function(let_table_visible, table_selector, data_name, call_back = async () => 0, how_many = 20) {
    log.info('click table rows:', let_table_visible, table_selector, data_name)
    if(let_table_visible) await click(let_table_visible)
    const ele = await find_ele(table_selector)
    if((!ele) || ! (await ele.isDisplayed())) throw `${table_selector} not show`
    let len = await get_table_len(data_name)
    if(len === 0) throw `can not get ${data_name} list`
    for(let i = Math.min(len, how_many);i > -1;i--) {
        await click_table_row(table_selector, get_num_from_1_to_n(len), call_back)
    }
}

global.click_table_buttons = async function(let_table_visible, table_selector, data_name, buttons, fallback = async () => 0, how_many = 20) {
    log.info('click table buttons:', let_table_visible, table_selector, data_name, buttons)
    if(let_table_visible) await click(let_table_visible)
    const ele = await find_ele(table_selector)
    if((!ele) || ! (await ele.isDisplayed())) throw `${table_selector} not show`
    let len = await get_table_len(data_name)
    if(len === 0) throw `can not get ${data_name} list`
    log.info('len is:', len)
    for(let i = Math.min(len, how_many);i > -1;i--) {
        for(let i = 0;i < buttons.length;i++) {
            await click_table_single_button(table_selector, get_num_from_1_to_n(len), `${buttons[i][0] === '.' ? buttons[i] : ('.' + buttons[i])}`)
            await fallback()
        }
    }
}

global.test_table_headers = async function(let_table_visible, table_selector, header_selectors, how_many = 6) {
    log.info('test table headers:', let_table_visible, table_selector, header_selectors)
    if(let_table_visible) await click(let_table_visible)
    const ele = await find_ele(table_selector)
    if((!ele) || ! (await ele.isDisplayed())) throw `${table_selector} not show`
    for(let i = 0;i < header_selectors.length;i++) {
        for(let j = 0;j < how_many;j++) await click_table_single_header(table_selector, header_selectors[i])
    }
}
