const {expect} = require('chai');
require("../utils/index");
require("../pool/utils");
log.updateLogFile("undelegate.test");

var _test_account ='';

var pool_map={};

if(TEST_CONFIG.current_target == "electron"){

	describe("Undelegate test", function(){
		before(async function(){
			//sign out the account if any account is signed
			let state = await get_current_state(".account.type");
			if(state!==""&& state!="visitor"){
				await click("#header-signin-out");

			}
			//sign in test account
			let random_acc_no = get_num_from_0_to_less_n(2);
			if (random_acc_no==0){
	          _test_account = TEST_CONFIG.test_accounts.private_key.address;
	          await signin_private_key();
	        }else{
	          _test_account = TEST_CONFIG.test_accounts.nmenomic_phrase.address;
	          await signin_phrase();
	        }

	        await goto_staking();
	        pool_map = await get_pools_map();
		});

		afterEach(async function(){
			await driver.sleep(TEST_CONFIG.wait_time);
			try{
				await close_modal();
				log.info("close any modal on the screen")
			}catch(e){
				log.info("NO modal on screen")
			}
			await goto_staking();
		})

		after(async function(){
			if(await get_current_state(".account.type==''")){
				await click("#header-signin-out");
			}
		})
		it('Undelegate-my_delegation_to_console', async function(){
			log.updateTest(this.test);
			try{
				await click("#staking-tab-delegations");
				let my_delegation = await get_non_zero_delegation();
				if(my_delegation.length == 0) throw new Error("Current account does not have any delegation; unable to perform undelegation.")
				let ri = get_num_from_0_to_less_n(my_delegation.length);
				log.debug(`select item ${ri} which should be ${my_delegation[ri].pool}`);
				await screenshot(this.test.title+"on_select_pool_section");
				await click_table_single_button_by_pool("#staking-table-delegations",pool_map[my_delegation[ri].pool].name,"undelegate");

				expect(await (await find_ele(".console-top #staking-console-top-operation-list .common-select-select")).getText()).to.equal("undelegate");
				await undelegate(my_delegation[ri],"full");
				expect( await(await find_ele("#modal-transaction-confirm")).isDisplayed()).not.to.be.null;
				await close_modal();
				await click("#staking-console-bottom-button.button");
				expect(await (await find_ele("#staking-console-transaction-amount")).getText()).to.equal(formatNumber(my_delegation[ri].stake));
				await click("#modal-transaction-confirm-button");
				await wait_for_ele("#modal-transaction-success");
				await driver.sleep(TEST_CONFIG.wait_time);
				await click("#modal-transaction-success-copy");
			    let txhash = await get_clipboard_content();
			    record_action("undelegate",_test_account,txhash,my_delegation[ri].skate,my_delegation[ri].pool);
			    let btn = await find_element_n_times('#modal-transaction-success-back');
			    await btn.click(); 
			}catch(e){
				log.error(e.message);
	            await screenshot(this.test.title+".error");
	            throw e;
			}

		});

		it('Undelegate-my_delegation_to_poolDetail_to_console', async function(){
			log.updateTest(this.test);
			try{
				await click("#staking-tab-delegations");
				let my_delegation = await get_non_zero_delegation ();
				if(my_delegation.length == 0) throw new Error("Current account does not have any delegation; unable to perform undelegation.")
				let ri = get_num_from_0_to_less_n(my_delegation.length)
				await click_table_row_by_pool("#staking-table-delegations",pool_map[my_delegation[ri].pool].name);
				expect(await (await find_ele("#pool-detail .top p")).getText()).to.equal(my_delegation[ri].pool);
				await click("#pool-detail-undelegate");
				let undelegate_amount= my_delegation[ri].stake*Math.random();
				await undelegate(my_delegation[ri],undelegate_amount);

				expect( await find_ele("#modal-transaction-confirm")).not.to.be.null;
				await close_modal();
				await click("#staking-console-bottom-button.button");
				expect(await (await find_ele("#staking-console-transaction-amount")).getText()).to.equal(formatNumber(undelegate_amount));
				await click("#modal-transaction-confirm-button");
				await wait_for_ele("#modal-transaction-success");
				await driver.sleep(TEST_CONFIG.wait_time);
				await click("#modal-transaction-success-copy");
				let txhash = await get_clipboard_content();
			    record_action("undelegate",_test_account,txhash,undelegate_amount,my_delegation[ri].pool);
			    let btn = await find_element_n_times('#modal-transaction-success-back');
			    await btn.click();
			}catch(e){
				log.error(e.message);
	            await screenshot(this.test.title+".error");
	            throw e;
			}
		});
		it('Undelegate_no_staking-my_delegation_to_poolDetails', async function(){
			log.updateTest(this.test);
			try{
				let ri = await find_non_delegate_active_pool();
				if(ri < 0) throw new Error("Unable to find a pool that is not delegated by this account");
				let pools = await get_pools();
				await click_table_row('#staking-table-pools', ri + 1);
				await driver.sleep(TEST_CONFIG.wait_time);
				expect(await (await find_ele("#pool-detail .top p")).getText()).to.equal(pools[ri].address);
				expect(await (await find_ele("#pool-detail-undelegate.button")).getAttribute("class")).to.have.string("disable");
			}catch(e){
				log.error(e.message);
	            await screenshot(this.test.title+".error");
	            throw e;
			}
		});


		it("Undelegate_nag-Undelegate_amount_more_stakes", async function(){
			log.updateTest(this.test);
			try{
				await click("#staking-tab-delegations");
				let my_delegation = await get_delegations_details();
				let ri = get_num_from_0_to_less_n(my_delegation.length)
				await click_table_single_button_by_pool("#staking-table-delegations",pool_map[my_delegation[ri].pool].name,"undelegate");

				expect(await find_ele(".console-top #staking-console-top-operation-list .common-select-select")).not.to.null;
				expect(await (await find_ele(".console-top #staking-console-top-operation-list .common-select-select")).getText()).to.equal("undelegate");
				let undelegate_amount= my_delegation[ri].stake*(1+Math.random());
				await undelegate(my_delegation[ri],undelegate_amount,true);
				expect(await (await find_ele("#staking-console-bottom-button.button")).getAttribute("class")).to.have.string("disable");
			
			}catch(e){
				log.error(e.message);
	            await screenshot(this.test.title+".error");
	            throw e;
			}
		})

	})
}


async function undelegate(fromPool_data,amount = "full", reselect = false){
	if(amount == "full"){
		await click("#console-top-full-amount");
		expect(await (await find_ele("#staking-console-top-input")).getAttribute("value")).to.equal(fromPool_data.stake.toString());
	}else{
		input("#staking-console-top-input",amount.toString());
	}
	if(reselect){
		await click("#staking-console-bottom-pool-list .common-select-select");
		await click(`#staking-console-bottom-pool-list .common-select-list-show span[title='${fromPool_data.pool}']`);
	}
	expect(await (await find_ele("#staking-console-bottom-pool-list .common-select-select span")).getAttribute('title')).to.equal(fromPool_data.pool);
	await click("#staking-console-bottom-button.button");
	return driver.sleep(TEST_CONFIG.short_timeout);
	
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