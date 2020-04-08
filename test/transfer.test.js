const {expect} = require('chai');
require("../utils/index");
require("../pool/utils");
log.updateLogFile("transfer.test");

var _test_account ='';
var pool_map= {};

if(TEST_CONFIG.current_target == "electron"){
	describe("Transfer test", function(){
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
	        pool_map = await get_pools_map();
	        await goto_staking();
	        await driver.sleep(TEST_CONFIG.short_timeout);
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

		it("Transfer-My Delegations_to_console",async function(){
			log.updateTest(this.test);
			try{
				await click("#staking-tab-delegations");
				let my_delegation = await get_non_zero_delegation();
				if(my_delegation.length == 0) throw new Error("Current account does not have any delegation; unable to perform delegation transfering.")
				let ri = get_num_from_0_to_less_n(my_delegation.length);
				let to_i = get_num_from_0_to_less_n(my_delegation.length);
				while(ri == to_i){
					to_i = get_num_from_0_to_less_n(my_delegation.length);
				}
				await click_table_single_button_by_pool("#staking-table-delegations",pool_map[my_delegation[ri].pool].name,"transfer");

				expect(await find_ele(".console-top #staking-console-top-operation-list .common-select-select")).not.to.null;
				expect(await (await find_ele(".console-top #staking-console-top-operation-list .common-select-select")).getText()).to.equal("transfer");
				
				await transfer(my_delegation[ri],my_delegation[to_i].pool,"full");
				expect( await (await find_ele("#modal-transaction-confirm")).isDisplayed()).to.be.true;
				await close_modal();
				await driver.sleep(TEST_CONFIG.wait_time);
				await click("#staking-console-bottom-button.button");
				await driver.sleep(TEST_CONFIG.wait_time);
				expect(await (await find_ele("#staking-console-transaction-amount")).getText()).to.equal(formatNumber(my_delegation[ri].stake));
				await click("#modal-transaction-confirm-button");
				await wait_for_ele("#modal-transaction-success");
				if(!(await wait_for_ele_appear("#modal-transaction-success"))){
					throw new Error("unable to get transaction success modal")
				}
				await click("#modal-transaction-success-copy");
			    let txhash = await get_clipboard_content();
			    record_action("transfer",_test_account,txhash,my_delegation[ri].skate,my_delegation[ri].pool+","+my_delegation[to_i].pool);
			    let btn = await find_element_n_times('#modal-transaction-success-back');
			    await btn.click(); 
			    await console_back_visible();
			}catch(e){
				log.error(e.message);
	            await screenshot(this.test.title+".error");
	            throw e;
			}

		});

		it("Transfer-poolDetails_to_console_reselect", async function(){
			log.updateTest(this.test);
			try{
				await click("#staking-tab-delegations");
				let my_delegation = await get_non_zero_delegation();
				if(my_delegation.length == 0) throw new Error("Current account does not have any stake; unable to perform transfer.")
				let ri = get_num_from_0_to_less_n(my_delegation.length);
				let to_i = get_num_from_0_to_less_n(my_delegation.length);
				while(ri == to_i){
					to_i = get_num_from_0_to_less_n(my_delegation.length);
				}
				await click_table_row_by_pool("#staking-table-delegations",pool_map[my_delegation[ri].pool].name);
				expect(await (await find_ele("#pool-detail .top p")).getText()).to.equal(my_delegation[ri].pool);
				await click("#pool-detail-undelegate");
				let transfer_amount= my_delegation[ri].stake*Math.random();
				await click("#staking-console-top-operation-list .common-select-select");
				await driver.sleep(TEST_CONFIG.wait_time);
				let actions = await find_eles("#staking-console-top-operation-list .common-select-list li")
				for(let i = 0; i < actions.length;i++){
					if((await actions[i].getText()).toLowerCase() == "transfer"){
						await actions[i].click();
						break;
					}
				}

				await transfer(my_delegation[ri],my_delegation[to_i].pool,transfer_amount);

				expect( await (await find_ele("#modal-transaction-confirm")).isDisplayed()).to.be.true;
				await close_modal();
				await click("#staking-console-bottom-button.button");
				expect(await (await find_ele("#staking-console-transaction-amount")).getText()).to.equal(formatNumber(transfer_amount));
				await click("#modal-transaction-confirm-button");
				await wait_for_ele("#modal-transaction-success");
				if(!(await wait_for_ele_appear("#modal-transaction-success"))){
					throw new Error("unable to get transaction success modal")
				}
				await click("#modal-transaction-success-copy");
				let txhash = await get_clipboard_content();
			    record_action("transfer",_test_account,txhash,transfer_amount,my_delegation[ri].pool+","+my_delegation[to_i].pool);
			    let btn = await find_element_n_times('#modal-transaction-success-back');
			    await btn.click();
			}catch(e){
				log.error(e.message);
	            await screenshot(this.test.title+".error");
	            throw e;
			}
		});

		it("Transfer_Neg-transfer_amount_more_stakes",async function(){
			log.updateTest(this.test);
			try{
				await click("#staking-tab-delegations");
				let my_delegation = await get_non_zero_delegation();
				let ri = get_num_from_0_to_less_n(my_delegation.length)
				await click_table_single_button_by_pool("#staking-table-delegations",pool_map[my_delegation[ri].pool].name,"transfer");

				expect(await find_ele(".console-top #staking-console-top-operation-list .common-select-select")).not.to.null;
				expect(await (await find_ele(".console-top #staking-console-top-operation-list .common-select-select")).getText()).to.equal("transfer");
				let transfer_amount= my_delegation[ri].stake*(1+Math.random());
				await transfer(my_delegation[ri],my_delegation[(ri+1)%my_delegation.length].pool,transfer_amount,true);
				expect(await (await find_ele("#staking-console-bottom-button.button")).getAttribute("class")).to.have.string("disable");
			
			}catch(e){
				log.error(e.message);
	            await screenshot(this.test.title+".error");
	            throw e;
			}
		})


	});
}



async function transfer(fromPool_data,toPool_address,amount = "full", reselect = false){
	if(amount == "full"){
		await click("#console-top-full-amount");
		log.debug(fromPool_data.stake.toString());
		expect(await (await find_ele("input#staking-console-top-input")).getAttribute("value")).to.equal(fromPool_data.stake.toString());
	}else{
		await input("#staking-console-top-input",amount.toString());
	}
	if(reselect){
		await click("#staking-console-bottom-pool-list .common-select-select");
		await click(`#staking-console-bottom-pool-list .common-select-list-show span[title='${fromPool_data.pool}']`);
	}

	await click("#staking-console-bottom-to-pool-list.to-pool-mySelect");
	await click(`#staking-console-bottom-to-pool-list .common-select-list-show span[title='${toPool_address}']`);
	
	expect(await (await find_ele("#staking-console-bottom-pool-list .common-select-select span")).getAttribute('title')).to.equal(fromPool_data.pool);
	expect(await (await find_ele("#staking-console-bottom-to-pool-list .common-select-select span")).getAttribute('title')).to.equal(toPool_address);
	await click("#staking-console-bottom-button.button");
	return driver.sleep(TEST_CONFIG.wait_time);
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