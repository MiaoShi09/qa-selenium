//import dependancies
const fs = require("fs");
const util = require("util");
const path = require("path");
//set up constant private value
const DEFAULT_LOG_FOLDER = TEST_CONFIG.log_config.log_dir_prefix+(new Date()).toJSON();
const LEVEL_VALUE={
  divider:0,
  error:0,
  info:1,
  debug:2
}
var _instance = null;



class Logger{
  static _currentInstance(){
    return _instance;
  }

  constructor(){
    if (!fs.existsSync(DEFAULT_LOG_FOLDER)){
        fs.mkdirSync(DEFAULT_LOG_FOLDER);
    }
    //this.path = DEFAULT_LOG_FOLDER+"/"+__filename+".log";
    this.level = LEVEL_VALUE[TEST_CONFIG.log_config.level] || LEVEL_VALUE["info"];
    this.enableConsoleLog = TEST_CONFIG.log_config.enable_console || true;
    _instance = this;
    this.test = {};
    this.filename = "logs"
  }


  updateTest(testObj){
    this.test = testObj;
    return this;
  }
  updateLogFile(newFileName){
    this.filename = newFileName;
    return this;
  }
  
  _logReport(){
      let formattedMessage = util.format.apply(util, arguments);
      this.test.consoleOutputs = (this.test.consoleOutputs || []).concat(formattedMessage);
  }

  _logError(){
      let formattedMessage = util.format.apply(util, arguments);
      this.test.consoleErrors = (this.test.consoleErrors || []).concat(formattedMessage);
  }
  info(info){
    if(this.level >= LEVEL_VALUE.info){
      if(this.enableConsoleLog){
        console.log("\x1b[96m%s\x1b[0m","[INFO]");
        console.log(info);
      }
      fs.appendFileSync(DEFAULT_LOG_FOLDER+"/"+this.filename+".log","[INFO] \t"+JSON.stringify(info)+"\n");
      this._logReport("[INFO]",info);

    }
  }

  debug(debugInfo){
    if(this.level >= LEVEL_VALUE.debug){
      if(this.enableConsoleLog){
        console.log("[DEBUG]");
        console.log(debugInfo);
      }
      fs.appendFileSync(DEFAULT_LOG_FOLDER+"/"+this.filename+".log","[DEBUG]\t"+JSON.stringify(debugInfo)+"\n");
      this._logReport("[DEBUG]",debugInfo);
    }
  }

  error(error){
    if(this.level >= LEVEL_VALUE.error){
      if(this.enableConsoleLog){
        console.log("\x1b[31m%s\x1b[0m","[ERROR]");
        console.log(error);
      }
      fs.appendFileSync(DEFAULT_LOG_FOLDER+"/"+this.filename+".log","[ERROR]\t"+JSON.stringify(error)+"\n");
      this._logError(error);
    }
  }

  divider(msg){
    if(this.level >= LEVEL_VALUE.divider){
      if(this.enableConsoleLog){
        console.log("\x1b[44m%s\x1b[0m","[DIVIDER]--------------------------------------------------------------");
        console.log(msg);
      }
      fs.appendFileSync(DEFAULT_LOG_FOLDER+"/"+this.filename+".log","---------------------"+msg+"-------------------------------\n");
      this._logReport("--------------------------------%s---------------------------\n",msg);
    }
  }

  log_dir(){
    return DEFAULT_LOG_FOLDER;
  }
}







global.log = new Logger();