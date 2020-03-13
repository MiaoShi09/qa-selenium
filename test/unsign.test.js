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
        '#modal-signin-keystore-file-button','#modal-signin-private-key-button','#modal-signin-mnenomic-phrase-button',
        '.bottom #modal-signin-browse-button'],
    chrome:['.middle1 .info a','.middle1 #modal-signin-ledger-button',
        '#modal-sigin-download-windows','#modal-sigin-download-mac','#modal-sigin-download-linux',
        '.bottom #modal-signin-browse-button']
}



describe("Unsign Tests",async()=>{
    beforeEach(async ()=>{
        if(global.driver == null){
            log.info("unable to find driver; re-open new test target:"+TEST_CONFIG.current_target)
            await start(TEST_CONFIG.current_target);
         }
         let type = await get_current_state(".account.type");
         while(type != ''){
            log.info("Detected the application is not in sign out mode; sign out current account first");
            try{
                await click(SIGNIN_IN_OUT_BTN)
            }catch(e){
                log.info(e.message);
                // await click("#sidebar-menu-account");
                // await driver.wait(until.elementLocated(By.css(SIGN_OUT_CROSS_BTN)), TEST_CONFIG.short_timeout);
                await signout_from_staking();
            }
            type = await get_current_state(".account.type");
         }
        

    });

    it("Dashboard without signin", async()=>{
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
            await screenshot(this.currentTest);
            return Promise.reject(e);
        }

    });
    it("Account without signin",async()=>{
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
            await screenshot(this.currentTest);
            return Promise.reject(e);
        }
    });
    it("Staking without signin",async()=>{
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

            expect(await (await find_ele(SIGN_OUT_CROSS_BTN)).isDisplayed()).to.be.false;
            expect(await (await find_ele(ACCOUNT_ADDR)).getAttribute("value")).to.equal("");
            log.checked(ACCOUNT_ADDR+"displays no account on screen as expected");

            await driver.sleep(TEST_CONFIG.wait_time);
            return Promise.resolve()

        }catch(e){
            log.error(e.message);
            await screenshot(this.currentTest);
            return Promise.reject(e);
        }
    });
    it("Open signin modal from dashbard", async ()=>{
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
            screenshot()
            return Promise.reject(e);
         }
    });

    it("Open signin modal from account", async ()=>{
         await goto_account();
    });

    it("Open signin modal from staking - tabs", async ()=>{
         await goto_staking();
    });

    it("Open signin modal from staking - random delegate btn", async ()=>{
        await goto_staking();
    })

});


async function check_signin_modal_elems(){
    let browser = TEST_CONFIG.current_target;
    let signin_modal = await find_ele(SIGN_IN_MODAL);

    expect(await (await find_ele(SIGN_IN_MODAL)).isDisplayed()).to.be.true;
    log.checked("Sigin in modal opened")
    SIGN_IN_MODAL_ELES[browser].forEach(async(selector)=>{
        expect(await (await find_ele(selector,signin_modal)).isDisplayed()).to.be.true;
        log.checked(selector+" is displayed on signin modal as expected.");
    });

   expect(await (await find_ele('.mode-selected',signin_modal)).getAttribute("value")).to.equal("standard");
   log.checked("Standard Mode is selected");
    // TODO figure out how to test open link in new browser for '>more'
}