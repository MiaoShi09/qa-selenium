const { expect } = require('chai');
require("../utils/common-utils");
log.updateLogFile("signin_modal.test");


const INVALID_NM_PHRASE = [""."wait try key run"]


describe("Signin modal Test",function(){

	describe("Common Test Cases",function(){
		beforeEach(async function(){
			let account_status = await get_current_state(".account");
			if(account_status.type!="" && account_status.type!="visitor"){
				await signout_from_random_place(account_status.type);
			}
			await driver.sleep(TEST_CONFIG.wait_time);
			await goto_random_place();
		});

		it("Signin with ledger when ledger is NOT connected", async function(){
			try{
				await click("#modal-signin-ledger-button");
				expect(await (await find_ele("#modal_signin_ledger")).isDisplayed()).to.be.true;
				await click("#modal-signin-ledger-signin");
				await driver.sleep(TEST_CONFIG.short_timeout);
				expect(await( await find_ele("#modal_signin_ledger p.err")).isDisplayed()).to.be.true;
				await click("#modal_signin_ledger svg.modal-sigin-ledger-back");
				expect(await( await find_ele("#modal_signin_ledger")).isDisplayed()).to.be.false;

			}catch(e){
				log.error(e.message);
		        await screenshot(this.test.title.substring(0,10)+" error");
		        return Promise.reject(e);
			}
		});


		if(TEST_CONFIG.current_target == "electron"){
			it("Signin with INVALID private key", async function(){
				try{
					await filling_signin_modal("private_key",'standard',TEST_CONFIG.test_accounts.private_key.pk.substring(0,128));
					log.debug(await (await find_eles(".message-container .message-item"))[0].getText() + "is the error message");
					expect(await (await find_eles(".message-container .message-item"))[0].getText()).to.equal("Invalid private key")
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title.substring(0,10)+" error");
			        return Promise.reject(e);
				}
			});


			it("Signin with INVALID nmenomic phrase",async function(){
				try{
					for(let i = 0; i < INVALID_NM_PHRASE.length; i++){
						await filling_signin_modal("phrase",'standard',INVALID_NM_PHRASE[i]);
						log.debug(await (await find_eles(".message-container .message-item"))[0].getText() + "is the error message");
						expect(await (await find_eles(".message-container .message-item"))[0].getText()).to.equal("Invalid nmenomic phrase")

					}
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title.substring(0,10)+" error");
			        return Promise.reject(e);
				}

			});
		}

	})


	describe("Sign in standard mode",function(){
		beforeEach(async function(){
			let account_status = await get_current_state(".account");
			if(account_status.type!="" && account_status.type!="visitor"){
				await signout_from_random_place(account_status.type);
			}
			await driver.sleep(TEST_CONFIG.wait_time);
			await goto_random_place();
		});


	
		if(TEST_CONFIG.current_target == "electron"){
			it("standard mode: Signin with private key", async function(){
				try{
					await filling_signin_modal("private_key",'standard',TEST_CONFIG.test_accounts.private_key.pk);
					verify_signin_success(TEST_CONFIG.test_accounts.private_key.address);
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title.substring(0,10)+" error");
			        return Promise.reject(e);
				}
			});

			

			it("standard mode: Signin with nmenomic phrase", async function(){
				try{
					await filling_signin_modal("phrase",'standard',TEST_CONFIG.test_accounts.nmenomic_phrase.words);
					verify_signin_success(TEST_CONFIG.test_accounts.nmenomic_phrase.address);
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title.substring(0,10)+" error");
			        return Promise.reject(e);
				}

			});



			xit("standard mode: Open keystore file",async function(){

			});
		}
	})

	describe("Sign in pool modal",function(){
		beforeEach(async function(){
			let account_status = await get_current_state(".account");
			if(account_status.type!="" || account_status.type !="visitor"){
				await signout_from_random_place(account_status.type);
			}
			await driver.sleep(TEST_CONFIG.wait_time);
			await goto_random_place();
		});



	
		if(TEST_CONFIG.current_target == "electron"){
			it("pool modal: Signin with private key", async function(){
				try{
					await filling_signin_modal("private_key",'pool',TEST_CONFIG.test_accounts.private_key.pk);
					verify_signin_success(TEST_CONFIG.test_accounts.private_key.address);
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title.substring(0,10)+" error");
			        return Promise.reject(e);
				}
			});

			

			it("pool modal: Signin with nmenomic phrase", async function(){
				try{
					await filling_signin_modal("phrase",'pool',TEST_CONFIG.test_accounts.nmenomic_phrase.words);
					verify_signin_success(TEST_CONFIG.test_accounts.nmenomic_phrase.address);
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title.substring(0,10)+" error");
			        return Promise.reject(e);
				}

			});
		}
	})

})




async function goto_random_place(){
	let random_method = get_num_from_0_to_less_n(5);
	let account_status = await get_current_state(".account");
	switch(random_method){
		case 0:
			if(account_status.mode == "pool"){
				await goto_pool();
				break;
			}else continue;
		case 1:
			
			await goto_staking();
			await goto_pool_detail();
			break;
			
		case 2:
			await goto_account();
			break;
		case 3:
			await goto_staking();
			break;
		default:
			await goto_dashboard();
	}
}

async function signout_from_random_place(){
	let random_method = get_num_from_0_to_less_n(7);
	switch(random_method){
		case 0:
			if(mode=="pool") {
				await signout_from_pool();
				break;
			}
		case 1:
			await signout_from_staking();
			break;
		case 2:// when visitor log in on pool manangement mode, they can sign out from pool section;
			await signout_from_account();
			break;
		case 3:
			if(mode=="pool") {
				await goto_pool();
				await click('#header-signin-out');
				break;
			}
		case 4:
			await goto_dashboard();
			await click('#header-signin-out');
			break;
		case 5:
			await goto_account();
			await click('#header-signin-out');
			break;
		case 6:
			await goto_staking();
			await click('#header-signin-out');
			break;
		default:
			await goto_pool_detail();
			await click('#header-signin-out');
	}
}

async function verify_signin_success(addr,mode == "standard"){
	let active_btn = await find_ele(".active");
	if(active_btn){
		switch(await active_btn.getText()){
			case "account":
				expect(await find_ele(`input[value="${addr}"]`,(await find_ele("#account-copy-refresh-clear-button-group")))).not.to.be.null;
				log.checked('verified signin success on Account section');
				break;
			case "staking":
				expect(await find_ele(`input[value^="${addr.substring(2,20)}"]`,(await find_ele("#staking-copy-refresh-clear-button-group")))).not.to.be.null;
				log.checked('verified signin success on Staking section');
				break;
			case "pool":
				expect(await find_ele(`input[value^="${addr}"]`,(await find_ele("#pool-copy-refresh-clear-button-group")))).not.to.be.null;
				log.checked('verified signin success on Pool section');
				break;
			default:
				await goto_dashboard();
				expect(await (await find_ele("#signed span")).getText()).to.equal(addr);
				log.checked("verified signin success on Dashboard section");

		}
	}
	let selector = '#sidebar-menu-pool-management';
	if(mode == "pool"){
		 expect(await (await find_ele(selector)).isDisplayed()).to.be.true;
         log.checked("In "+mode+" "+selector+" is displayed on screen as expected.");
	}else{
		 expect(await (await find_ele(selector)).isDisplayed()).to.be.false;
         log.checked("In "+mode+" "+selector+" is NOT displayed on screen as expected.");
	}
}