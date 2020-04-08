const { expect } = require('chai');
const {util} = require("selenium-webdriver");
require("../utils/common-utils");


log.updateLogFile("unsign.test");

const DASHBOARD_ELES = ['#dashboard-get-started','#dashboard .unsigned'];
const SIDEBAR_URLS = ['#sidebar-contact-us', '#sidebar-docs'];
const HIDDEN_ELES = ['#sidebar-menu-pool-management'];
const ACCOUNT_ELES = ['#modal-unsignined-signin','#account .StakingUnSigned'];
const STAKING_ELES = ['#staking-tab-pools','#staking-tab-delegations','#staking-tab-rewards','#staking-tab-finalizations'];
const SIGNIN_IN_OUT_BTN = "#header-signin-out";
const SIGN_OUT_CROSS_BTN = "svg.clear-address";
const ACCOUNT_ADDR = ".tab_nav input"
const SIGN_IN_MODAL = '#modal_signin'

const SIGN_IN_MODAL_ELES = {
    electron:['.middle1 .info a','.middle1 #modal-signin-ledger-button',
        '#modal-signin-keystore-file-button','#modal-signin-private-key-button','#modal-signin-mnemonic-phrase-button',
        '.bottom #modal-signin-browse-button'],
    chrome:['.middle1 .info a','.middle1 #modal-signin-ledger-button',
        '#modal-signin-download-windows','#modal-signin-download-mac','#modal-signin-download-linux',
        '.bottom #modal-signin-browse-button']
}



describe("Unsign Tests",function(){
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
                log.info(e.message);
                // await click("#sidebar-menu-account");
                // await driver.wait(until.elementLocated(By.css(SIGN_OUT_CROSS_BTN)), TEST_CONFIG.short_timeout);
                await screenshot(this.currentTest+".beforeEach.error");
                await signout_from_staking();
            }
            type = await get_current_state(".account.type");
         }
        

    });

    it("Unsign-Dashboard", async function(){
        await goto_dashboard();
        try{
            let active_btn = await find_ele(".active");
            expect(await active_btn.getText()).to.equal("dashboard");
            log.checked("Dashboard on side bar is active as expected.");
            expect(await (await find_ele(SIGNIN_IN_OUT_BTN)).getText()).to.equal("Sign In");
            log.checked("Sign In buttton is displayed on the screen");
            DASHBOARD_ELES.forEach(async(selector)=>{
                expect(await (await find_ele(selector)).isDisplayed()).to.be.true;
                log.checked(selector+" is displayed on screen as expected.");
            });
            SIDEBAR_URLS.forEach(async(selector)=>{
                expect(await (await find_ele(selector)).isDisplayed()).to.be.true;
                log.checked(selector+" is displayed on screen as expected.");
            });
            HIDDEN_ELES.forEach(async(selector)=>{
                expect(await (await find_ele(selector)).isDisplayed()).to.be.false;
                log.checked(selector+" is NOT displayed on screen as expected.");
            });

            await driver.sleep(TEST_CONFIG.wait_time);
            return Promise.resolve()
        }catch(e){
            log.error(e.message);
            await screenshot(this.test.title+".error");
            return Promise.reject(e);
        }

    });
    it("Unsign-Account",async function(){
        await goto_account();
        try{
            let active_btn = await find_ele(".active");
            expect(await active_btn.getText()).to.equal("account");

            expect(await (await find_ele(SIGNIN_IN_OUT_BTN)).getText()).to.equal("Sign In");
            log.checked("Sign In buttton is displayed on the screen");
            ACCOUNT_ELES.forEach(async(selector)=>{
                expect(await (await find_ele(selector)).isDisplayed()).to.be.true;
                log.checked(selector+" is displayed on screen as expected.");
            });
            SIDEBAR_URLS.forEach(async(selector)=>{
                expect(await (await find_ele(selector)).isDisplayed()).to.be.true;
                log.checked(selector+" is displayed on screen as expected.");
            });
            HIDDEN_ELES.forEach(async(selector)=>{
                expect(await (await find_ele(selector)).isDisplayed()).to.be.false;
                log.checked(selector+" is NOT displayed on screen as expected.");
            });

            await driver.sleep(TEST_CONFIG.wait_time);
            return Promise.resolve()

        }catch(e){
            log.error(e.message);
            await screenshot(this.test.title+".error");
            return Promise.reject(e);
        }
    });
    it("Unsign-Staking",async function(){
        await goto_staking();
        try{
            let active_btn = await find_ele(".active");
            expect(await active_btn.getText()).to.equal("staking");

            expect(await (await find_ele(SIGNIN_IN_OUT_BTN)).getText()).to.equal("Sign In");
            log.checked("Sign In buttton is displayed on the screen");
            STAKING_ELES.forEach(async(selector)=>{
                expect(await (await find_ele(selector)).isDisplayed()).to.be.true;
                log.checked(selector+" is displayed on screen as expected.");
            });
            SIDEBAR_URLS.forEach(async(selector)=>{
                expect(await (await find_ele(selector)).isDisplayed()).to.be.true;
                log.checked(selector+" is displayed on screen as expected.");
            });
            HIDDEN_ELES.forEach(async(selector)=>{
                expect(await (await find_ele(selector)).isDisplayed()).to.be.false;
                log.checked(selector+" is NOT displayed on screen as expected.");
            });

            expect(await (await find_ele(SIGN_OUT_CROSS_BTN)).isDisplayed()).to.be.false;
            expect(await (await find_ele(ACCOUNT_ADDR)).getAttribute("value")).to.equal("");
            log.checked(ACCOUNT_ADDR+"displays no account on screen as expected");

            await driver.sleep(TEST_CONFIG.wait_time);
            return Promise.resolve()

        }catch(e){
            log.error(e.message);
            await screenshot(this.test.title+".error");
            return Promise.reject(e);
        }
    });
    it("Unsign-Open_signin_modal_from_dashbard", async function(){
         await goto_dashboard();
         try{
            log.info("try open sign in modal from header btn");
            await click(SIGNIN_IN_OUT_BTN);
            
            await check_signin_modal_elems();
            await close_modal();
            log.info("try open sign in modal from \'Get Started\' btn");
            await click("#dashboard-get-started");
            await check_signin_modal_elems();
            await close_modal();
         }catch(e){
            log.error(e.message);
            await screenshot(this.test.title+" error");
            return Promise.reject(e);
         }
    });

    it("Unsign-Open_signin_modal_from_account", async function(){
        await goto_account();
        try{
             log.info("try open sign in modal from header btn");
             await click(SIGNIN_IN_OUT_BTN);
             await check_signin_modal_elems();
             await close_modal();
             log.info("try open sign in modal on modal")
             await click("#modal-unsignined-signin");
             await check_signin_modal_elems();
             await close_modal();
             
        }catch(e){
            log.error(e.message);
           
            await screenshot(this.test.title+".error");
            return Promise.reject(e);
        }

    });
    it("Unsign-Open_signin_modal_from_staking_headers", async function(){
        await goto_staking();
        await driver.sleep(TEST_CONFIG.wait_time);
        try{
             log.info("try open sign in modal from header btn");
             await click(SIGNIN_IN_OUT_BTN);
             await check_signin_modal_elems();
             await close_modal();             
        }catch(e){
            log.error(e.message);
           
            await screenshot(this.test.title+".error");
            return Promise.reject(e);
        }

    })

    it("Unsign-Open_signin_modal_from_staking_tabs", async function(){
         await goto_staking();
         await driver.sleep(TEST_CONFIG.wait_time);
         try{
            log.info("try open sign in modal from tab headers");
            for(let index = 0; index< STAKING_ELES.length; index++){
                let selector = STAKING_ELES[index];
                log.debug(selector);
                log.debug(index);
                let visiblity = await (await find_ele("#staking-table-pools")).isDisplayed();
                log.debug("clicking "+selector+": #staking-table-pools visiblity is "+ visiblity);
                await click(selector);
                await driver.sleep(TEST_CONFIG.wait_time);
                if( index > 0 ){
                    await check_signin_modal_elems();
                    await close_modal();
                }else{
                    expect(await (await find_ele("#staking-table-pools")).isDisplayed()).to.be.true;
                    expect(await (await find_ele(SIGN_IN_MODAL)).isDisplayed()).to.be.false;
                }

             }
             
        }catch(e){
            log.error(e.message);
            await screenshot(this.test.title+".error");
            return Promise.reject(e);
        }

    });

    it("Unsign-Open_signin_modal_from_staking_random_pool_delegate_btn", async function(){
        await goto_staking();
        await driver.sleep(TEST_CONFIG.short_timeout);
        try{
            log.info("When not sign in any account, clicking delegate button should opens sign in modal");
            let num_pools = await get_current_state(".pools.length");
            log.debug(num_pools);
            for(let i =0; i < 2; i ++){
                let random_num = get_num_from_1_to_n(num_pools);
                await click(`#staking-table-pools table tr:nth-child(${random_num}) .button`);
                await check_signin_modal_elems();
                await close_modal();        
                await driver.sleep(TEST_CONFIG.wait_time);
            }
        }catch(e){
            log.error(e.message);
            await screenshot(this.test.title+".error");
            return Promise.reject(e);
        }

    });

    it("Unsign-Open_siginin_modal_from_staking_pool_details_page", async function(){
        await goto_staking();
        await driver.sleep(TEST_CONFIG.short_timeout);
         try{
            log.info("When not sign in any account, clicking delegate button in each staking pool page opens sign in modal");
            let num_pools = await get_current_state(".pools.length");
            log.debug(num_pools);
            for(let i =0; i < 2; i ++){
                let random_num = get_num_from_1_to_n(num_pools);
                await click(`#staking-table-pools table tr:nth-child(${random_num})`);
                await driver.sleep(TEST_CONFIG.wait_time);
                expect(await (await find_ele("#pool-detail")).isDisplayed()).to.be.true;
                await click('#pool-detail-delegate.button');
                await check_signin_modal_elems();
                await close_modal();        
                await driver.sleep(TEST_CONFIG.wait_time);
                log.info("try open sign in modal from header btn");
                await click(SIGNIN_IN_OUT_BTN);
                await check_signin_modal_elems();
                await close_modal();             
                await click_back_img();

            }
        }catch(e){
            log.error(e.message);
            await screenshot(this.test.title+".error");
            return Promise.reject(e);
        }
    });

    it("Unsign-User_should_not_be_able_to_access_console_page", async function(){
        try{
            let console_url = TEST_CONFIG.domain[TEST_CONFIG.current_target]+"/staking/console";
            await driver.navigate(console_url);
            await driver.sleep(TEST_CONFIG.short_timeout);
            expect(await driver.getCurrentUrl()).not.to.equal(console_url);
            log.checked("current url is not "+console_url);
        }catch(e){
            log.error(e.message);
            await screenshot(this.test.title+".error");
            return Promise.reject(e);
        }
    })
});


async function check_signin_modal_elems(){
    let browser = TEST_CONFIG.current_target;
    let signin_modal = await find_ele(SIGN_IN_MODAL);

    expect(await signin_modal.isDisplayed()).to.be.true;
    log.checked("Sigin in modal opened")
    SIGN_IN_MODAL_ELES[browser].forEach(async(selector)=>{
        expect(await (await find_ele(selector,signin_modal)).isDisplayed()).to.be.true;
        log.checked(selector+" is displayed on signin modal as expected.");
    });

   expect(await (await find_ele('.mode-selected',signin_modal)).getAttribute("value")).to.equal("standard");
   log.checked("Standard Mode is selected");
    // TODO figure out how to test open link in new browser for '>more'
}