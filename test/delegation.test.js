
const { get_balance } = require("../test_staking/utils");
const {expect} = require('chai');
require("../utils/index");
log.updateLogFile("delegate.test");



if(TEST_CONFIG.current_target=='electron'){
  describe('Delegation', function() {
    beforeEach(async function() {

      if(global.driver == null){
        log.info("unable to find driver; re-open new test target:"+TEST_CONFIG.current_target)
        await start(TEST_CONFIG.current_target);
      }
     // await global.driver.navigate().to(TEST_CONFIG.url);
      await goto_staking();
      await signin_private_key();
      const balance = await get_balance();
      expect(balance, 'balance should > 0, but is ' + balance).to.above(0);
      await driver.sleep(TEST_CONFIG.short_timeout)
    });

    afterEach(async function() {
      await driver.sleep(TEST_CONFIG.short_timeout);
    });

    it('test pools->console', async function() {
      let ri = await find_active_pool();
      await click_table_single_button('#staking-table-pools', ri + 1, '.button')
      await delegate_in_console(Math.random());
    });

    it('test pools->pool detail->console', async function() {
      let ri = await find_active_pool();
      await click_table_row('#staking-table-pools', ri + 1);
      await click('#pool-detail-delegate');
      await delegate_in_console(Math.random());
    });
  });
}else{
  xdescribe('Delegation', function() {
    xit("chrome only allows ledger signin; Skip automated test on delegation on Chrome");
  })
}



const delegate_in_console = async (amount) => {
    await input_console(amount);
    await pop_submit_button();
    await submit_transaction();
    let btn = await find_element_n_times('#modal-transaction-success-back');
    await btn.click(); 
    await driver.navigate().back();
}

const find_active_pool = async () => {
    const pools = JSON.parse((await get_current_state()).pools);
    expect(pools.length, "pool length should > 0, but is " + pools.length).to.above(0);
    let ri = -1;
    for (let i = 0; i < pools.length; i++) {
      ri = get_num_from_0_to_less_n(pools.length);
      if (pools[ri].active === '0x01' && parseFloat(pools[ri].stake_self) >= 1000) {
        break;
      }
    }
    expect(ri, 'all pools are inactive').to.not.eql(-1);
    return ri;
}

const find_element_n_times = async (selector, times = 10, sleep = 500) => {
  let count = 0;
  do {
    element = await ele_can_click(selector);
    count++;
    await driver.sleep(sleep);
  } while (element === null && count <= times);
  expect(element, "can't locate " + selector).to.not.be.null;
  return element;
};