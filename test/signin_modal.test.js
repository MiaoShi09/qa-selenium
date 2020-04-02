const { expect } = require('chai');
require("../utils/common-utils");
log.updateLogFile("signin_modal.test");


const INVALID_NM_PHRASE = ["","wait try key run"]


describe("Signin modal Test",function(){
	afterEach(async function(){
		//close signin modal
		if(await( await find_ele("#modal_signin")).isDisplayed())
			await click("svg#modal-signin-close");
		
	})

	describe("Common Test Cases",function(){
		beforeEach(async function(){
			let account_status = await get_current_state(".account");
			if(account_status.type!="" && account_status.type!="visitor"){
				await signout_from_random_place(account_status.type);
			}
			await driver.sleep(TEST_CONFIG.wait_time);

			await goto_random_place();
			await click("#header-signin-out");
		});

		it("Signin with ledger when ledger is NOT connected", async function(){
			try{

				await click("#modal-signin-ledger-button");

				expect(await (await find_ele("#modal_signin_ledger")).isDisplayed()).to.be.true;
				await click("#modal-signin-ledger-signin");
				await driver.sleep(TEST_CONFIG.short_timeout);
				expect(await( await find_ele("#modal_signin_ledger p.err")).isDisplayed()).to.be.true;
				await click("#modal_signin_ledger svg#modal-signin-ledger-back");
				expect(await( await find_ele("#modal_signin_ledger")).isDisplayed()).to.be.false;
				expect(await( await find_ele("#modal_signin")).isDisplayed()).to.be.true;

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
					log.debug(await (await find_ele("#modal-signin-private-key p.err")).getText() + "is the error message");
					expect(await (await find_ele("#modal-signin-private-key p.err")).getText()).to.equal("Invalid private key");
					await click("svg#modal-signin-private-key-back");
					expect(await( await find_ele("#modal_signin")).isDisplayed()).to.be.true;
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
						let error_msg = await(await find_ele("#modal-signin-mnemonic p.err")).getText();
						log.debug(error_msg + "is the error message");
						expect(error_msg).to.equal("Invalid mnemonic");
						await click("svg#modal-signin-mnemonic-back");
						expect(await( await find_ele("#modal_signin")).isDisplayed()).to.be.true;
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
			await click("#header-signin-out");
		});


	
		if(TEST_CONFIG.current_target == "electron"){
			it("standard mode: Signin with private key", async function(){
				try{
					await filling_signin_modal("private_key",'standard',TEST_CONFIG.test_accounts.private_key.pk);
					await verify_signin_success(TEST_CONFIG.test_accounts.private_key.address);
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title.substring(0,10)+" error");
			        return Promise.reject(e);
				}
			});

			

			it("standard mode: Signin with nmenomic phrase", async function(){
				try{
					await filling_signin_modal("phrase",'standard',TEST_CONFIG.test_accounts.nmenomic_phrase.words);
					await verify_signin_success(TEST_CONFIG.test_accounts.nmenomic_phrase.address);
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title.substring(0,10)+" error");
			        return Promise.reject(e);
				}

			});



			xit("standard mode: Signin with keystore file",async function(){
				try{
					await filling_signin_modal("keystore",'standard',TEST_CONFIG.test_accounts.keystore.path);
					await verify_signin_success(TEST_CONFIG.test_accounts.keystore.address);
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title.substring(0,10)+" error");
			        return Promise.reject(e);
				}
			});
		}
	})

	describe("Sign in pool modal",function(){
		beforeEach(async function(){
			try{
				let account_status = await get_current_state(".account");
				if(account_status.type!="" || account_status.type !="visitor"){
					await signout_from_random_place();
				}
				await driver.sleep(TEST_CONFIG.wait_time);
				await goto_random_place();
				await click("#header-signin-out");
			}catch(e){
				log.error(e.message);
			    await screenshot(this.currentTest+" error");
			    return Promise.reject(e);
			}
		});


	
		if(TEST_CONFIG.current_target == "electron"){
			it("pool modal: Signin with private key", async function(){
				try{
					await filling_signin_modal("private_key",'pool',TEST_CONFIG.test_accounts.private_key.pk);					
					await verify_signin_success(TEST_CONFIG.test_accounts.private_key.address,'pool');
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title.substring(0,10)+" error");
			        return Promise.reject(e);
				}
			});

			

			it("pool modal: Signin with nmenomic phrase", async function(){
				try{
					await filling_signin_modal("phrase",'pool',TEST_CONFIG.test_accounts.nmenomic_phrase.words);
					await verify_signin_success(TEST_CONFIG.test_accounts.nmenomic_phrase.address,'pool');
				}catch(e){
					log.error(e.message);
			        await screenshot(this.test.title.substring(0,10)+" error");
			        return Promise.reject(e);
				}

			});
		}

	})

})



async function verify_signin_success(addr,mode = "standard"){
	let active_btn = await find_eles(".active");
	if(active_btn.length >0){
		switch(await active_btn[0].getText()){
			case "account":
				expect(await find_ele(`input[value="${addr}"]`,(await find_ele("#account-copy-refresh-clear-button-group")))).not.to.be.null;
				log.checked('verified signin success on Account section');
				break;
			case "staking":
				expect(await find_ele(`input[value^="${addr.substring(2,20)}"]`,(await find_ele("#staking-copy-refresh-clear-button-group")))).not.to.be.null;
				log.checked('verified signin success on Staking section');
				break;
			case "pool":
				expect(await find_ele(`input[value^="${addr}"]`,(await find_ele("#pool-management-copy-refresh-clear-button-group")))).not.to.be.null;
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