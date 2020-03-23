const { expect } = require('chai');
require("../utils/common-utils");

log.updateLogFile("unsign.test");

const TEST_ACCOUNT = TEST_CONFIG.test_accounts.nmenomic_phrase.address;
const SIGNIN_IN_OUT_BTN = "#header-signin-out";
const DISABLED_BTNS = {
	dashboard:["#dashboard-delegate", "#dashboard-withdraw"],
	account:[".balance .button", "#staked-amount .button", "reward .button"], // wait for send button id
	staking:[".staking-table-pools-ts-buttons div",
		 ".staking-table-delegations-td-buttons .button",
		 "#staking-table-rewards .button"],
	pool:["#pool-management-register-edit-pool.button"]
}

describe("Browse Mode Test",function(){
	describe("Browse Mode and Standard Mode", function(){
		before(async function(){
			let account_state = await get_current_state(".account");

			while(account_state.type !="visitor" || account_state.mode != "standard" ){
				log.debug(JSON.stringify(account_state));
				if(account_state.type!="") await signout_from_staking();
				await signin_with_header_button("visitor","standard",TEST_ACCOUNT);
				account_state = await get_current_state(".account");
			}

		})

		it("Pool Management section is hidden when sign in standard mode",async function(){
			try{
				expect(await (await find_ele("#sidebar-menu-pool-management")).isDisplayed()).to.be.false;
			}catch(e){
				log.error(e.message);
		        await screenshot(this.test.title.substring(0,10)+" error");
		        return Promise.reject(e);
			}
		})

		it("Delegate and withdraw buttons are disabled on dashboard",async function(){
			await goto_dashboard();
			expect(await (await find_ele(SIGNIN_IN_OUT_BTN)).getText()).to.equal("Sign In");
            log.checked("Sign In buttton is displayed on the screen");
			await driver.sleep(TEST_CONFIG.wait_time);
			try{
				for(let i =0; i < DISABLED_BTNS.dashboard.length; i++){
					await checkForBtnDisabled(DISABLED_BTNS.dashboard[i]);
				}
			}catch(e){
				log.error(e.message);
		        await screenshot(this.test.title+" error");
		        return Promise.reject(e);
			}
		});

		it("Learn more buttons should navigate to help pages", async function(){
			const targets = ["Staking Actions","Staking Pools","Account Page"]
			await goto_dashboard();
			
			try{
				let learn_more_sec = await find_eles(".help-item");
				if(learn_more_sec.length !=3) throw new Error("please double check your selector");
				for(let i = 0; i < 3; i++){
					await click(".button",learn_more_sec[i]);
					await verifyLearnMoreBtn(targets[i]);
					learn_more_sec = await find_eles(".help-item");
				}

			}catch(e){
				log.error(e.message);
		        await screenshot(this.test.title+" error");
		        return Promise.reject(e);
			}
		});

		it("Send, Delegate, Un-Delegate, Withdraw button should be disabled in Account section", async function(){
			try{
				await goto_account();
			
				expect(await (await find_ele(SIGNIN_IN_OUT_BTN)).getText()).to.equal("Sign In");
            	log.checked("Sign In buttton is displayed on the screen");
				let account_sec = await find_ele("#account .signed");
				let btns = await find_eles(".button",account_sec);
				log.debug("find "+btns.length+" buttons; expected to get 4");

				for(let i = 0; i < btns.length; i++){
					await checkForBtnDisabled(btns[i]);
				}

			}catch(e){
				log.error(e.message);
		        await screenshot(this.test.title.substring(0,10)+" error");
		        return Promise.reject(e);
			}

		});

		it("All buttons in Staking section should be disalbed",async function(){
			try{
				await goto_staking();
				expect(await (await find_ele(SIGNIN_IN_OUT_BTN)).getText()).to.equal("Sign In");
            	log.checked("Sign In buttton is displayed on the screen");

				log.info("Check delegate button on pool list")
				let pool_num = await get_current_state(".pools.length");
				for(let i =0; i < 3; i++){
					let random_num = get_num_from_1_to_n(pool_num);
					checkForBtnDisabled(`#staking-table-pools table tr:nth-child(${random_num}) .button`);
				}


				log.info("check buttons under My delegations tab");
				await click('#staking-tab-delegations');
				let my_del_list = await find_ele("table");
				let btns = await find_eles(".button",my_del_list);
				log.debug("find "+btns.length+" buttons");
				for(let i = 0; i < btns.length; i++){
					await checkForBtnDisabled(btns[i]);
				}


				log.info("check buttons under Rewards & Auto-Delegation");
				await  click('#staking-tab-rewards');
				let my_reward_list = await find_ele("table");
				btns = await find_eles(".button",my_reward_list);
				log.debug("find "+btns.length+" buttons");
				let switches = await find_eles(".common-switch");
				for(let i = 0; i < btns.length; i++){
					await checkForBtnDisabled(btns[i]);
					await checkForBtnDisabled(switches[i]);
				}
			}catch(e){
				log.error(e.message);
		        await screenshot(this.test.title.substring(0,10)+" error");
		        return Promise.reject(e);
			}
		})


	});
	describe("Browse Mode and Pool Management Mode", function(){
		before(async function(){
			let account_state = await get_current_state(".account");

			while(account_state.type !="visitor" || account_state.mode != "pool" ){
				log.debug(JSON.stringify(account_state));
				if(account_state.type!="") await signout_from_staking();
				await signin_with_header_button("visitor","pool",TEST_ACCOUNT);
				account_state = await get_current_state(".account");
			}

		});

		it("Pool Management section is NOT hidden when sign in pool mode",async function(){
			try{
				expect(await (await find_ele("#sidebar-menu-pool-management")).isDisplayed()).to.be.true;
			}catch(e){
				log.error(e.message);
		        await screenshot(this.test.title.substring(0,10)+" error");
		        return Promise.reject(e);
			}
		})

		it("Button in pool management section is disabled", async function(){
			try{
				await goto_pool();
				expect(await (await find_ele(SIGNIN_IN_OUT_BTN)).getText()).to.equal("Sign In");
            	log.checked("Sign In buttton is displayed on the screen");
				await checkForBtnDisabled(DISABLED_BTNS.pool[0]);
			}catch(e){
				log.error(e.message);
		        await screenshot(this.test.title.substring(0,10)+" error");
		        return Promise.reject(e);
			}
		})
	})
	

});



async function checkForBtnDisabled(button){
	if(typeof button ==="string") button = await find_ele(button);
	expect(await button.getAttribute("class")).to.have.string("disable");
	log.checked(await button.getText()+" is disabled as expected");

}

async function verifyLearnMoreBtn(dist){
	let navigator = await find_ele(".help-detail-container .navigator");
	expect(await navigator.getText()).to.have.string(dist);
	log.checked("Landed on "+ dist+" section as expected");
	log.debug(await driver.getCurrentUrl());
	return click_back_img();
}