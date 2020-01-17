const {Builder} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require("../utils/common-utils");
require("../utils/index");

before(async function() {
  if (process.env.chromedriver) {
    await chrome.setDefaultService(new chrome.ServiceBuilder(process.env.chromedriver).build());
  }
  global.driver = await new Builder().forBrowser('chrome').build();
  global.base_url = 'https://192.168.50.118:3000';
  await driver.get(global.base_url);
});

after(async function() {
  global.driver.quit();
});