####for start:
1. run command `npm install`;
2. run `export PATH=$PATH:$PWD/node_module/.bin`
2. download chromedriver v73 for upk test and another version for your browser which need to be added  to system path;
3. start staking interface test on chrome:
```bash
mocha --file=test/chrome.setup.js --no-timeouts
```
4. start staking interface test on desktop application:
  4.1. update the path of desktop app
  4.2. start chromedriver v73
  4.3. run `mocha --file=test/chrome.setup.js --no-timeouts`




Copy commands in package.json to run the test, but DO NOT run test script with `npm run`. `npm run` will add additional environment varibles when starting webdriver which makes the webdriver terminated early.