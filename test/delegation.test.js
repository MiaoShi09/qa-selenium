
const { get_balance } = require("../test_staking/utils");
const {expect} = require('chai');
require("../utils/index");
log.updateLogFile("delegate.test");

var _test_account ='';

if(TEST_CONFIG.current_target=='electron'){
  describe('Delegation', function() {
    beforeEach(async function() {
      log.updateTest(this.currentTest);
      if(global.driver == null){
        log.info("unable to find driver; re-open new test target:"+TEST_CONFIG.current_target)
        await start(TEST_CONFIG.current_target);
      }
      try{
        await goto_staking();
        let random_account = get_num_from_0_to_less_n(2);
        
        if (random_account==0){
          _test_account = TEST_CONFIG.test_accounts.private_key.address;
          await signin_private_key();
        }else{
          _test_account = TEST_CONFIG.test_accounts.nmenomic_phrase.address;
          await signin_phrase();
        }
      }catch(e){
          log.error(e.message);
          await screenshot(this.currentTest+".error");
          throw e;
      }
      let balance = await get_current_state(".balance.toNumber()");
      if(balance < 1) throw new Error("Current account "+_test_account+" does not have enougth test coin.")
      await driver.sleep(TEST_CONFIG.short_timeout)
    });

    afterEach(async function() {
      await click("#header-signin-out");
      await driver.sleep(TEST_CONFIG.short_timeout);
    });

    it('Delegate-from_pools_to_console_active', async function() {
      try{
        let ri = await find_active_pool();
        await click_table_single_button('#staking-table-pools', ri + 1, '.button')
        await delegate_in_console(Math.random());
      }catch(e){
        log.error(e.message);
            await screenshot(this.test.title+".error");
            return Promise.reject(e);
      }
    });

    it('Delegate-from_pools_to_pool_details_console_active', async function() {
      try{
        let ri = await find_active_pool();
        await click_table_row('#staking-table-pools', ri + 1);
        await click('#pool-detail-delegate');
        await delegate_in_console(Math.random());
      }catch(e){
        log.error(e.message);
            await screenshot(this.test.title+".error");
            return Promise.reject(e);
      }
    });

    it('Delegate-from_pools_to_console_inactive', async function(){
      try{
        let ri = await find_inactive_pool();
        await click_table_single_button('#staking-table-pools', ri + 1, '.button')
        expect(await (await find_ele('#modal_staking_warning')).isDisplayed(),"modal_staking warning expected to show up.").to.be.true;
        await click("#modal_staking_warning #modal_staking_warning-cancel");
        expect(await (await find_ele('#modal_staking_warning')).isDisplayed(),"modal_staking warning expected to show up.").to.be.false;
        await click_table_single_button('#staking-table-pools', ri + 1, '.button');
        await click("#modal_staking_warning #modal_staking_warning-go-ahead");
        await delegate_in_console(Math.random());
      }catch(e){
        log.error(e.message);
            await screenshot(this.test.title+".error");
            return Promise.reject(e);
      }
    });

    it('Delegate-from_pools_to_pool_details_console_inactive',async function(){
      try{
        let ri = await find_inactive_pool();
        await click_table_row('#staking-table-pools', ri + 1);
        await click('#pool-detail-delegate');
        expect(await (await find_ele('#modal_staking_warning')).isDisplayed(),"modal_staking warning expected to show up.").to.be.true;
        await click("#modal_staking_warning #modal_staking_warning-cancel");
        expect(await (await find_ele('#modal_staking_warning')).isDisplayed(),"modal_staking warning expected to show up.").to.be.false;
        await click('#pool-detail-delegate');
        await click("#modal_staking_warning #modal_staking_warning-go-ahead");
        
        await delegate_in_console(Math.random());
      }catch(e){
        log.error(e.message);
            await screenshot(this.test.title+".error");
            return Promise.reject(e);
      }
    })

  });
}



var delegate_in_console = async (amount) => {
    await input_console(amount);
    await pop_submit_button();
    await submit_transaction();
    await driver.sleep(TEST_CONFIG.wait_time);
    //await screenshot("delegate_in_console");
    await click("#modal-transaction-success-copy");
    let txhash = await get_clipboard_content();
    let receiver = await (await find_ele(".console-bottom .top #staking-console-bottom-pool-list .common-select-select span:nth-child(2)")).getAttribute("title");
    record_action("delegate",_test_account,txhash,amount,receiver);
    let btn = await find_element_n_times('#modal-transaction-success-back');
    await btn.click(); 
   
}

var find_active_pool = async () => {
    
    const pools = await get_current_state(".pools.map(o=>{return {active:o.active,stake_self:o.stake_self.toNumber()}});");
    
    expect(pools.length, "pool length should > 0, but is " + pools.length).to.above(0);
    let ri = -1;
    for (let i = 0; i < pools.length; i++) {
      ri = get_num_from_0_to_less_n(pools.length);
      if (pools[ri].active === '0x01' && pools[ri].stake_self >= 1000) {
        break;
      }
    }
   
    expect(ri, 'all pools are inactive').to.not.eql(-1);
    return ri;
}

var find_inactive_pool = async ()=>{
    
    const pools = await get_current_state(".pools.map(o=>{return {active:o.active,stake_self:o.stake_self.toNumber()}});");
    
    expect(pools.length, "pool length should > 0, but is " + pools.length).to.above(0);
    let ri = -1;
    for (let i = 0; i < pools.length; i++) {
      ri = get_num_from_0_to_less_n(pools.length);
      if (pools[ri].active === '0x00' || pools[ri].stake_self < 1000) {
        break;
      }
    }
    
    expect(ri, 'all pools are inactive').to.not.eql(-1);
    return ri;
}

var find_element_n_times = async (selector, times = 10, sleep = 500) => {
  let count = 0;
  do {
    element = await ele_can_click(selector);
    count++;
    await driver.sleep(sleep);
  } while (element === null && count <= times);
  expect(element, "can't locate " + selector).to.not.be.null;
  return element;
};