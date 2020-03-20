const { get_balance } = require("../test_staking/utils");
const {expect} = require('chai');
require("../utils/index");
require("../paths/index")
log.updateLogFile("navigation.test");


const pool_detail_suffixs = {
	exist:['0xa0ce1062d72bae67bce48509e1b196753d2a90655be1402c0069ecc0cd47210e'], 
	non_exist:['','dadfklahfl']
};
const table_names = {
	exist:['', 'pools', 'finalizations', 'delegations', 'Rewards & Auto-delegation'],
	non_exist:['','refgesrfgergf']
	}
const dashboard_help_suffixs = {
	exist:['Staking Actions', 'Staking Pool', 'Account Page'],
	non_exist:['', 'regfersgse']}

const menu_items = ['dashboard','account','staking','pool']


describe("navigate to different directly by address", function(){
	describe("common navigation",function(){
		for(let i = 0;i < 3;i++){
			it("directly go to "+ menu_items[0],async function(){
				try{
					await skip_to_menu_item(menu_items[0]);
					let expected_url = `${ TEST_CONFIG.domain[TEST_CONFIG.current_target] }/${menu_items[i]}`;
					expect(await driver.getCurrentUrl()).to.equal(expected_url);
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title+" error");
			        return Promise.reject(e);
				}
			});
		}

		for(let key in dashboard_help_suffixs){
			
			dashboard_help_suffixs[key].forEach((help_page)=>{
				it("direly go to help page "+help_page, async function(){
					try{
						await skip_to_help_page(help_page);
						let url = `${ TEST_CONFIG.domain[TEST_CONFIG.current_target] }/dashboard/${help_page}`;
						let current_url = await driver.getCurrentUrl();
						log.debug(`Current url is ${current_url} and it should be ${key}.`);
						if(key === 'exist'){
							expect(current_url).to.equal(url);
						}else{
							expect(current_url).not.to.equal(url);
						}
					}catch(e){
						log.error(e.message);
				        await screenshot(this.test.title+" error");
				        return Promise.reject(e);
					}
				})
			});
		}

		for(let key in pool_detail_suffixs){
			pool_detail_suffixs[key].forEach((pool_addr)=>{
				it("direly go to help page "+pool_addr, async function(){
					try{
						await skip_to_staking(pool_addr);
						let url = `${ TEST_CONFIG.domain[TEST_CONFIG.current_target] }/staking/${pool_addr}`;
						let current_url = await driver.getCurrentUrl();
						log.debug(`Current url is ${current_url} and it should be ${key}.`);
						if(key === 'exist'){
							expect(current_url).to.equal(url);
						}else{
							expect(current_url).not.to.equal(url);
						}
					}catch(e){
						log.error(e.message);
				        await screenshot(this.test.title+" error");
				        return Promise.reject(e);
					}
				})
			});
		}
	})
	
	describe("When user is not signin",function(){

		//make sure the user does not sign in any address
		beforeEach(async function(){
			if(global.driver == null){
	            log.info("unable to find driver; re-open new test target:"+TEST_CONFIG.current_target)
	            await start(TEST_CONFIG.current_target);
	         }
	         await driver.sleep(TEST_CONFIG.wait_time);
	         let type = await get_current_state(".account.type");
	         while(type != ''){
	            log.info("Detected the application is not in sign out mode; sign out current account first");
	            try{
	                await signout_from_staking()
	            }catch(e){
	                log.info(e.message);

	                await screenshot(this.currentTest+" error");
	                await signout_from_staking();
	            }
	            type = await get_current_state(".account.type");
	         }
		});
		it("pool should NOT be able to access pool section", async function(){
			await skip_to_menu_item(menu_items[3]);
			let expected_url = `${ TEST_CONFIG.domain[TEST_CONFIG.current_target] }/${menu_items[i]}`;
			expect(await driver.getCurrentUrl()).not.to.equal(expected_url);
		});
	})

	describe("when user uses standard mode",function(){
		beforeEach(async function(){
			let account_state = await get_current_state(".account");

			while(account_state.type !="visitor" || account_state.mode != "standard" ){
				log.debug(JSON.stringify(account_state));
				if(account_state.type!="") await signout_from_staking();
				await signin_with_header_button("visitor","standard",TEST_ACCOUNT);
				account_state = await get_current_state(".account");
			}
		})


		it("pool should NOT be able to  access pool section", async function(){
			await skip_to_menu_item(menu_items[3]);
			let expected_url = `${ TEST_CONFIG.domain[TEST_CONFIG.current_target] }/${menu_items[i]}`;
			expect(await driver.getCurrentUrl()).not.to.equal(expected_url);
		});

	})

	describe("when user uses pool mode",function(){
		beforeEach(async function(){
			let account_state = await get_current_state(".account");

			while(account_state.type !="visitor" || account_state.mode != "pool" ){
				log.debug(JSON.stringify(account_state));
				if(account_state.type!="") await signout_from_staking();
				await signin_with_header_button("visitor","pool",TEST_ACCOUNT);
				account_state = await get_current_state(".account");
			} 
		})

		it("pool should be able to access pool section", async function(){
			await skip_to_menu_item(menu_items[3]);
			let expected_url = `${ TEST_CONFIG.domain[TEST_CONFIG.current_target] }/${menu_items[i]}`;
			expect(await driver.getCurrentUrl()).to.equal(expected_url);
		});

	});
})