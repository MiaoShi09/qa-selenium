####for start:
1. npm i -g selenium-webdriver
2. download chromedriver for your browser and add it to system path
3. start staking interface
4. node test



Copy commands in package.json to run the test, but DO NOT run test script with `npm run`. `npm run` will add additional environment varibles when starting webdriver which makes the webdriver terminated early.