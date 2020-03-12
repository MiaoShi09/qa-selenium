const {Builder} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require("../utils/common-utils");
require("../utils/index");
log.updateLogFile("chrome.setup");

global.TEST_CONFIG.current_target = 'chrome';

before(async function() {
  await start(TEST_CONFIG.current_target);
  return driver.sleep(TEST_CONFIG.wait_time);
});

after(async function() {
  await driver.quit();
});