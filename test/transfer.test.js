const {expect} = require('chai');
require("../utils/index");
require("../pool/utils");
log.updateLogFile("transfer.test");

var _test_account ='';
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

        await goto_staking();
        await driver.sleep(TEST_CONFIG.short_timeout);
	});


	it("My Delegations -> console",async function(){

		try{
			await click("#staking-tab-delegations");
			let my_delegation = await get_delegations_details();
			if(my_delegation.length == 0) throw new Error("Current account does not have any delegation; unable to perform delegation transfering.")
			let ri = get_num_from_0_to_less_n(my_delegation.length);
			let to_i = get_num_from_0_to_less_n(my_delegation.length);
			while(ri == to_i){
				to_i = get_num_from_0_to_less_n(my_delegation.length);
			}
			await click_table_single_button_by_pool("#staking-table-delegations",pool_map[my_delegation[ri].pool].name,"transfer");

			expect(await find_ele(".console-top #staking-console-top-operation-list .common-select-select")).not.to.null;
			expect(await (await find_ele(".console-top #staking-console-top-operation-list .common-select-select")).getText()).to.equal("Transfer");
			
			transfer(my_delegation[ri],my_delegation[to_i].pool,"full");
			expect( await find_ele("#modal-transaction-confirm")).not.to.be.null;
			await close_modal();
			await driver.sleep(TEST_CONFIG.wait_time);
			await click("#staking-console-bottom-button.button");
			await driver.sleep(TEST_CONFIG.wait_time);
			expect(await (await find_ele("#staking-console-transaction-amount")).getText()).to.equal(my_delegation[ri].skate.toFixed(5));
			await click("#modal-transaction-confirm-button");
			await wait_for_ele("#modal-transaction-success");

			await click("#modal-transaction-success-copy");
		    let txhash = await get_clipboard_content();
		    record_action("transfer",_test_account,txhash,my_delegation[ri].skate,my_delegation[ri].pool+","+my_delegation[to_i].pool);
		    let btn = await find_element_n_times('#modal-transaction-success-back');
		    await btn.click(); 
		    await console_back_visible();
		}catch(e){
			log.error(e.message);
            await screenshot(this.test.title.substring(0,10)+" error");
            throw e;
		}

	});

	it("pool-details -> console -> reselect action", async function()=>{
		try{
			await click("#staking-tab-delegations");
			let my_delegation = await get_delegations_details();
			if(my_delegation.length == 0) throw new Error("Current account does not have any delegation; unable to perform undelegation.")
			let ri = get_num_from_0_to_less_n(my_delegation.length);
			let to_i = get_num_from_0_to_less_n(my_delegation.length);
			while(ri == to_i){
				to_i = get_num_from_0_to_less_n(my_delegation.length);
			}
			await click_table_row_by_pool("#staking-table-delegations",pool_map[my_delegation[ri].pool].name);
			expect(await (await find_ele("#pool-detail .top p")).getText()).to.equal(my_delegation[ri].pool);
			await click("#pool-detail-undelegate");
			let transfer_amount= my_delegation[ri].stake*Math.random();
			await click("#staking-console-top-operation-list common-select-select");
			let actions = await fine_eles("#staking-console-top-operation-list common-select-list li")
			for(let i = 0; i < actions.length;i++){
				if((await actions[i].getText()).toLowerCase() == "transfer"){
					await actions[i].click();
					break;
				}
			}

			transfer(my_delegation[ri],my_delegation[to_i].pool,transfer_amount);

			expect( await find_ele("#modal-transaction-confirm")).not.to.be.null;
			await close_modal();
			await click("#staking-console-bottom-button.button");
			expect(await (await find_ele("#staking-console-transaction-amount")).getText()).to.equal(transfer_amount.toFixed(5));
			await click("#modal-transaction-confirm-button");
			await wait_for_ele("#modal-transaction-success");

			await click("#modal-transaction-success-copy");
			let txhash = await get_clipboard_content();
		    record_action("transfer",_test_account,txhash,transfer_amount,my_delegation[ri].pool+","+my_delegation[to_i].pool);
		    let btn = await find_element_n_times('#modal-transaction-success-back');
		    await btn.click();
		}catch(e){
			log.error(e.message);
            await screenshot(this.test.title.substring(0,10)+" error");
            throw e;
		}
	});

	it("Negative case: transfer amount larger than that is delegated in the selected pool ",async function(){
		try{
			await click("#staking-tab-delegations");
			let my_delegation = await get_delegations_details();
			let ri = get_num_from_0_to_less_n(my_delegation.length)
			await click_table_single_button_by_pool("#staking-table-delegations",pool_map[my_delegation[ri].pool].name,"transfer");

			expect(await find_ele(".console-top #staking-console-top-operation-list .common-select-select")).not.to.null;
			expect(await (await find_ele(".console-top #staking-console-top-operation-list .common-select-select")).getText()).to.equal("transfer");
			let transafer_amount= my_delegation[ri].stake*(1+Math.random());
			transfer(my_delegation[ri],my_delegation[(ri+1)%my_delegation.length].pool,transfer_amount,true);
			expect(await (await find_ele("#staking-console-bottom-button.button")).getAttribute("class")).to.have.string("disable");
		
		}catch(e){
			log.error(e.message);
            await screenshot(this.test.title.substring(0,10)+" error");
            throw e;
		}
	})


});



async function transfer(fromPool_data,toPool_address,amount = "full", reselect = false){
	if(amount == "full"){
		await click("#console-top-full-amount");
		expect(await (await find_ele("input#staking-console-top-input")).getAttribute("value")).to.equal(fromPool_data.stake.toString());
	}else{
		input("#staking-console-top-input",amount.toString());
	}
	if(reselect){
		await click("#staking-console-bottom-pool-list .common-select-select");
		await click(`#staking-console-bottom-pool-list .common-select-list-show span[title='${fromPool_data.pool}']`);
	}

	await click("#staking-console-bottom-to-pool-list .to-pool-mySelect");
	await click(`#staking-console-bottom-to-pool-list .common-select-list-show span[title='${toPool_address}']`
	
	expect(await (await find_ele("#staking-console-bottom-pool-list .common-select-select span")).getAttribute('title')).to.equal(fromPool_data.pool);
	expect(await (await find_ele("#staking-console-bottom-to-pool-list .to-pool-mySelect span")).getAttribute('title')).to.equal(toPool_address);
	return click("staking-console-bottom-button.button");
	
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