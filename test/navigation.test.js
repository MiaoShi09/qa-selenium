const { get_balance } = require("../test_staking/utils");
const {expect} = require('chai');
require("../utils/index");
require("../paths/utils")
log.updateLogFile("navigation.test");


const pool_detail_suffixs = {
	exist:['0xa05649144074f25a35a9a8734a52cbd91e4939a3edd31f370b59ecea7575090f'], 
	non_exist:['','dadfklahfl']
};
const table_names = ['pools', 'finalizations', 'delegations', 'Rewards%20&%20Auto-delegation','refgesrfgergf',''];
	
const staking_content = {
	finalizations: "#staking-table-finalizations",
	delegations: "#staking-table-delegations",
	'Rewards%20&%20Auto-delegation': "#staking-table-rewards",
	default:"#staking-table-pools"
}

const dashboard_help_suffixs = {
	exist:['Staking%20Actions', 'Staking%20Pools', 'Account%20Page'],
	non_exist:[ 'regfersgse','']}

const menu_items = ['dashboard','account','staking/pools','pool-management'];

const url_404 = TEST_CONFIG.domain[TEST_CONFIG.current_target]+"/404";
const default_level_one_url =  TEST_CONFIG.domain[TEST_CONFIG.current_target]+"/dashboard";


describe("navigate to different directly by address", function(){
	describe("common navigation",function(){
		for(let i = 0;i < 3;i++){
			it("common_nav-directly_go_to_"+ menu_items[i],async function(){
				log.updateTest(this.test);
				try{
					await skip_to_menu_item(menu_items[i]);
					let expected_url = `${ TEST_CONFIG.domain[TEST_CONFIG.current_target] }/${menu_items[i]}`;
					expect(await driver.getCurrentUrl()).to.equal(expected_url);
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title+".error");
			        return Promise.reject(e);
				}
			});
		}

		for(let key in dashboard_help_suffixs){
			
			dashboard_help_suffixs[key].forEach((help_page,index)=>{
				it("common_nav-directly_go_to_help_page_"+help_page, async function(){
					log.updateTest(this.test);
					try{
						await skip_to_help_page(help_page);
						let url = `${ TEST_CONFIG.domain[TEST_CONFIG.current_target] }/dashboard/help/${help_page}`;
						await driver.sleep(TEST_CONFIG.wait_time);
						let current_url = await driver.getCurrentUrl();
						log.debug(`Current url is ${current_url} and it should be ${key}.`);
						if(key === 'exist'){
							expect(current_url).to.equal(url);
						}else{
							if(index < 1) expect(current_url).to.equal(url_404);
							else expect(current_url).to.equal(default_level_one_url);
						}
					}catch(e){
						log.error(e.message);
				        await screenshot(this.test.title+".error");
				        return Promise.reject(e);
					}
				})
			});
		}

		for(let key in pool_detail_suffixs){
			pool_detail_suffixs[key].forEach((pool_addr,index)=>{
				it("common_nav-directly_go_to_pool_detail_"+pool_addr, async function(){
					log.updateTest(this.test);
					try{
						await skip_to_pool_detail(pool_addr);
						let url = `${ TEST_CONFIG.domain[TEST_CONFIG.current_target] }/pool/${pool_addr}`;
						await driver.sleep(TEST_CONFIG.short_timeout);
						let current_url = await driver.getCurrentUrl();
						log.debug(`Current url is ${current_url} and it should be ${key}.`);
						
						if(key === 'exist'){
							expect(current_url).to.equal(url);
						}else{
							if(index > 0)
								expect(current_url).to.equal(url_404);
							else
								expect(current_url).to.equal(default_level_one_url);
						}
					}catch(e){
						log.error(e.message);
				        await screenshot(this.test.title+".error");
				        return Promise.reject(e);
					}
				})
			});
		}
	})
	
	describe("When user is not signin",function(){

		//make sure the user does not sign in any address
		beforeEach(async function(){
			log.updateTest(this.currentTest);
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
	                log.error(e.message);

	                await screenshot(this.currentTest+".error");
	                await signout_from_staking();
	            }
	            type = await get_current_state(".account.type");
	         }
		});
		it("unsign_nav-users_CANNOT_direct_to_pool_section", async function(){
			try{
				await skip_to_menu_item(menu_items[3]);
				let expected_url = `${ TEST_CONFIG.domain[TEST_CONFIG.current_target] }/${menu_items[3]}`;
				log.info(await driver.getCurrentUrl());
				expect(await driver.getCurrentUrl()).to.equal(default_level_one_url);
			}catch(e){
				log.error(e.message);
                await screenshot(this.test.title+".error");
                throw e;
			}
		});


		table_names.forEach((tab_name,index)=>{

			it("unsign_nav-users_go_to_staking_tab_"+tab_name+"_directly_from_url",async function(){
				try{
					let expected_url = `${ TEST_CONFIG.domain[TEST_CONFIG.current_target] }/staking/${tab_name}`
					await skip_to_staking_tab(tab_name);
					expect( await find_ele("#staking-table-pools")).not.to.be.null;
					log.checked(`${expected_url} go to staking pools`);
				}catch(e){
 					log.error(e.message);
	                await screenshot(this.test.title+".error");
	                throw e;
				}
			});
		})

	})

	describe("when user uses standard mode",function(){
		beforeEach(async function(){
			log.updateTest(this.currentTest);
			let account_state = await get_current_state(".account");
			log.debug(account_state);

			while(account_state.type !="visitor" || account_state.mode != "standard" ){
				log.debug(JSON.stringify(account_state));
				if(account_state.type!="") await signout_from_staking();
				await signin_with_header_button("visitor","standard",TEST_CONFIG.test_accounts.private_key.address);
				account_state = await get_current_state(".account");
			}
		})


		it("std_nav-users_CANNOT_access_pool_section", async function(){
			await skip_to_menu_item(menu_items[3]);
			let expected_url = `${ TEST_CONFIG.domain[TEST_CONFIG.current_target] }/${menu_items[3]}`;
			expect(await driver.getCurrentUrl()).to.equal(default_level_one_url);
		});


		table_names.forEach((tab_name,index)=>{

			it(`std_nav-users_go_to_staking_tab_${tab_name}_directly_from_url`,async function(){
				try{
					let expected_url = `${ TEST_CONFIG.domain[TEST_CONFIG.current_target] }/staking/${tab_name}`
					await skip_to_staking_tab(tab_name);
					expect( await find_ele(staking_content[tab_name]|| staking_content.default)).not.to.be.null;
					log.checked(`${expected_url} go to staking pools ${staking_content[tab_name]|| staking_content.default}`);
				}catch(e){
 					log.error(e.message);
	                await screenshot(this.test.title+".error");
	                throw e;
				}
			});
		})

	})

	describe("when user uses pool mode",function(){
		beforeEach(async function(){
			log.updateTest(this.currentTest);
			let account_state = await get_current_state(".account");

			while(account_state.type !="visitor" || account_state.mode != "pool" ){
				log.debug(JSON.stringify(account_state));
				if(account_state.type!="") await signout_from_staking();
				await signin_with_header_button("visitor","pool",TEST_CONFIG.test_accounts.private_key.address);
				account_state = await get_current_state(".account");
			} 
		})

		it("pool_nav-direct_to_pool_section", async function(){
			await skip_to_menu_item(menu_items[3]);
			let expected_url = `${ TEST_CONFIG.domain[TEST_CONFIG.current_target] }/${menu_items[3]}`;
			expect(await driver.getCurrentUrl()).to.equal(expected_url);
		});

	});


})