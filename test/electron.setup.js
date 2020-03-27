const {Builder} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require("fs");
require("../utils/common-utils");
require("../utils/index");
log.updateLogFile("electron.setup");
global.TEST_CONFIG.current_target = 'electron';

before(async function() {
  let balance = await checkBalance(TEST_CONFIG.test_accounts.nmenomic_phrase.address);
  if(balance <1) await getTestCoin(TEST_CONFIG.test_accounts.nmenomic_phrase.address,10)

  await start(TEST_CONFIG.current_target);

  return driver.sleep(TEST_CONFIG.wait_time);
});

after(async function() {
  await driver.quit();
  if(global.RECORDER!=undefined){
  	await fs.writeFile(log.log_dir()+"/"+"performed_tx.json",JSON.stringify(RECORDER),(err)=>{
            if(err){
                log.error(err);
                return Promise.reject(err);
            }
        });
  }
});