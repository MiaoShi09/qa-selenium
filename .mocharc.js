'use strict';

module.exports = {
	"reporter": ['mocha-junit-reporter'],
    "reporterOptions": {
        "mochaFile": "./test_reports/test"+Date.now()+".xml"
    },
  "spec": [
    "./test/**.test.js"
    //"test/browse_mode.test.js"
  ],
  "timeout": 0,
};