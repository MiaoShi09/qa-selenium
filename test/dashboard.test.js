const { expect } = require('chai');
require("../utils/common-utils");
log.updateLogFile("dashboard.test");


const NO_BALANCE_ACCOUNT = TEST_CONFIG.test_accounts.no_balance_pk;
const MAIN_TEST_ACCOUNT = TEST_CONFIG.test_accounts.private_key;



if(TEST_CONFIG.current_target == "electron"){
	describe("Dashboard section test",function(){

		describe("Dashboard-signin_no_balance",function(){
			before(async function(){
				let balance = await checkBalance(NO_BALANCE_ACCOUNT.address);
				log.debug("Balance: "+balance);
				if(balance == 0) {
					await goto_random_place();
					await click("#header-signin-out");
					await filling_signin_modal("private_key",'pool', NO_BALANCE_ACCOUNT.pk);
					await goto_dashboard();
				}else{
					throw new Error(`This address ${NO_BALANCE_ACCOUNT.address} has balance: ${balance} AION.`);
				}
				
			});

			after(async function(){
				await click("#header-signin-out");
			})

			it("Dashboard_no_bal-Delegate_btn_disable", async function(){
				log.updateTest(this.test);
				try{
					let balance = await get_current_state(".balance.toString()");
					log.debug(balance);
					expect(balance).to.equal("0");
					let Delegate_btn = await find_ele("#dashboard-delegate");
					expect(await Delegate_btn.getAttribute("class")).to.have.string("disable");
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title.substring(0,10)+" error");
			        return Promise.reject(e);
				}
			});

			it("Dashboard_no_reward-Withdraw_btn_disable", async function(){
				log.updateTest(this.test);
				try{
					let rewards = await get_current_state(".my_total_cur_rewards.toString()");
					if(rewards=="0"){
						expect(await (await find_ele("#dashboard-withdraw")).getAttribute("class")).to.have.string("disable");
					}else{
						expect(await (await find_ele("#dashboard-withdraw")).getAttribute("class")).not.to.have.string("disable");
					}	
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title.substring(0,10)+" error");
			        return Promise.reject(e);
				}
		
			});


		});

		describe("Dashboard-signin_with_balance",function(){
			before(async function(){
				let balance = await checkBalance(MAIN_TEST_ACCOUNT.address);
				log.debug("Balance: "+balance);
				if(balance > 0) {
					await goto_random_place();
					await click("#header-signin-out");
					await filling_signin_modal("private_key",'pool', MAIN_TEST_ACCOUNT.pk);
					await goto_dashboard();
				}else{
					throw new Error(`This address ${MAIN_TEST_ACCOUNT.address} has balance: ${balance} AION.`);
				}
			});

			after(async function(){
				await click("#header-signin-out");
			})

			afterEach(async function(){
				await goto_dashboard();
			})

			it("Dashboard_no_bal-Delegate_navigate_to_staking_pools", async function(){
				log.updateTest(this.test);
				try{
					let Delegate_btn = await find_ele("#dashboard-delegate");
					await Delegate_btn.click();
					let current_url = await driver.getCurrentUrl();
					log.debug(current_url);

					expect(await find_ele("#staking-table-pools")).not.to.be.null;
					expect(await (await find_ele("#staking .tab_nav .active")).getText()).to.equal("Pools");
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title.substring(0,10)+" error");
			        return Promise.reject(e);
				}
			});

			it("Dashboard_with_reward-Withdraw_navigate_to_staking_rewards", async function(){
				log.updateTest(this.test);
				try{
					let undelegation_btn = await find_ele("#dashboard-withdraw");
					await undelegation_btn.click();
					let current_url = await driver.getCurrentUrl();
					log.debug(current_url);

					expect(await find_ele("#staking-table-rewards")).not.to.be.null;
					expect(await (await find_ele("#staking .tab_nav .active")).getText()).to.equal("Rewards & Auto-delegation");
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title.substring(0,10)+" error");
			        return Promise.reject(e);
				}
			})
		})




	})
}