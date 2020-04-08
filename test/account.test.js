const { get_balance } = require("../test_staking/utils");
const {expect} = require('chai');

log.updateLogFile("account.test");

const NO_BALANCE_ACCOUNT = TEST_CONFIG.test_accounts.no_balance_pk;
const MAIN_TEST_ACCOUNT = TEST_CONFIG.test_accounts.private_key;

if(TEST_CONFIG.current_target == "electron"){

	describe("account section test",function(){
		describe("Common cases",function(){
			before(async function(){

				await goto_random_place();
				await click("#header-signin-out");
				await filling_signin_modal("private_key",'pool', MAIN_TEST_ACCOUNT.pk);	
				await goto_account();
			});

			after(async function(){
				await click("#header-signin-out");
			})

			it("Common_acc-Copy_address_into_clipboard",async function(){
				log.updateTest(this.test);
				await click("#account-copy-refresh-clear-button-group img.copy");
				expect(await get_clipboard_content()).to.equal(MAIN_TEST_ACCOUNT.address);
			})
		})

		describe("signin with an account which does not have balance",function(){
			before(async function(){
				let balance = await checkBalance(NO_BALANCE_ACCOUNT.address);
				log.debug("Balance: "+balance);
				if(balance == 0) {
					await goto_random_place();
					await click("#header-signin-out");
					await filling_signin_modal("private_key",'pool', NO_BALANCE_ACCOUNT.pk);
					await goto_account();
				}else{
					throw new Error(`This address ${NO_BALANCE_ACCOUNT.address} has balance: ${balance} AION.`);
				}
				
			});

			after(async function(){
				await click("#header-signin-out");
			})

			it("Acc_no_bal-Send_btn_should_be_disabled", async function(){
				log.updateTest(this.test);
				try{	
					let balance = await get_current_state(".balance.toString()");
					log.debug("check state balance");
					log.debug(balance);
					expect(balance.toString()).to.equal("0");
					let send_btn = (await find_eles(".balance .button"))[0];
					expect(await send_btn.getText()).to.equal("Send");
					expect(await send_btn.getAttribute("class")).to.have.string("disable");
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title+".error");
			        return Promise.reject(e);
				}
			});
			it("Acc_no_bal-Delegate_btn_should_be_disabled", async function(){
				log.updateTest(this.test);
				try{
					let balance = await get_current_state(".balance.toString()");
					log.debug(balance.toString());
					expect(balance.toString()).to.equal("0");
					let Delegate_btn = await find_ele("#account-delegate");
					expect(await Delegate_btn.getAttribute("class")).to.have.string("disable");
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title+".error");
			        return Promise.reject(e);
				}
			});
			it("Acc_no_staking-UnDelegate_btn_should_be_disabled",async function(){
				log.updateTest(this.test);
				try{
					let stake = await get_current_state(".my_total_cur_stake.toString()");
					log.info(stake);
					if(stake=="0"){
						expect(await (await find_ele("#account-undelegate")).getAttribute("class")).to.have.string("disable");
					}else{
						expect(await (await find_ele("#account-undelegate")).getAttribute("class")).not.to.have.string("disable");
					}	
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title+".error");
			        return Promise.reject(e);
				}
			});

			it("Acc_no_rewards-Withdraw_btn_should_be_disabled", async function(){
				log.updateTest(this.test);
				try{
					let rewards = await get_current_state(".my_total_cur_rewards.toString()");
					log.info(rewards);
					if(rewards=="0"){
						expect(await (await find_ele("#account-withdraw")).getAttribute("class")).to.have.string("disable");
					}else{
						expect(await (await find_ele("#account-withdraw")).getAttribute("class")).not.to.have.string("disable");
					}	
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title+".error");
			        return Promise.reject(e);
				}
		
			});

		});


		describe("signin with an account which have balance",function(){
			before(async function(){
				let balance = await checkBalance(MAIN_TEST_ACCOUNT.address);
				log.debug("Balance: "+balance);
				if(balance > 0) {
					await goto_random_place();
					await click("#header-signin-out");
					await filling_signin_modal("private_key",'pool', MAIN_TEST_ACCOUNT.pk);
					await goto_account();
					let _balance = await get_current_state(".balance.toString()");
					log.debug("check state balance");
					log.debug(_balance);
					let rewards = await get_current_state(".my_total_cur_rewards.toString()");
					log.info("rewards: "+rewards);
					let stake = await get_current_state(".my_total_cur_stake.toString()");
					log.info("current stake: " +stake);

				}else{
					throw new Error(`This address ${MAIN_TEST_ACCOUNT.address} has balance: ${balance} AION.`);
				}
			});

			after(async function(){
				await click("#header-signin-out");
			})

			afterEach(async function(){
				await goto_account();
			})

			it("Acc_bal-Send_btn_should_navigate_to_transfter_sect", async function(){
				log.updateTest(this.test);
				try{
					let send_btn = (await find_eles(".balance .button"))[0];
					await send_btn.click();
					let current_url = await driver.getCurrentUrl();
					log.debug(current_url);
					let selected_option_ele = await find_ele(".common-select-select");
					expect(await selected_option_ele.getText()).to.equal("send");
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title+".error");
			        return Promise.reject(e);
				}
			});

			it("Acc_bal-Delegate_btn_should_navigate_to_staking_pools", async function(){
				log.updateTest(this.test);
				try{
					let Delegate_btn = await find_ele("#account-delegate");
					await Delegate_btn.click();
					let current_url = await driver.getCurrentUrl();
					log.debug(current_url);

					expect(await find_ele("#staking-table-pools")).not.to.be.null;
					expect(await (await find_ele("#staking .tab_nav .active")).getText()).to.equal("Pools");
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title+".error");
			        return Promise.reject(e);
				}
			});

			it("Acc_staking-UnDelegate_btn_should_navigate_to_my_delegations", async function(){
				log.updateTest(this.test);
				try{
					let undelegation_btn = await find_ele("#account-undelegate");
					await undelegation_btn.click();
					let current_url = await driver.getCurrentUrl();
					log.debug(current_url);

					expect(await find_ele("#staking-table-delegations")).not.to.be.null;
					expect(await (await find_ele("#staking .tab_nav .active")).getText()).to.equal("My Delegations");
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title+".error");
			        return Promise.reject(e);
				}
			});

			it("Acc_rewards-Withdraw_btn_should_navigate_to_staking_rewards", async function(){
				log.updateTest(this.test);
				try{
					let undelegation_btn = await find_ele("#account-withdraw");
					await undelegation_btn.click();
					let current_url = await driver.getCurrentUrl();
					log.debug(current_url);

					expect(await find_ele("#staking-table-rewards")).not.to.be.null;
					expect(await (await find_ele("#staking .tab_nav .active")).getText()).to.equal("Rewards & Auto-delegation");
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title+".error");
			        return Promise.reject(e);
				}
			})


		})


	})

}
