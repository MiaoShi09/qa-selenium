// This is jenkinsfile for qa_selenium repo

#!/usr/bin/env groovy

def message, lastCommit, tag, rpcResult, latest_commit

@NonCPS
def getCommit(){
    def changeLogSets = currentBuild.changeSets
    def m = "";
    for (int i = 0; i < changeLogSets.size(); i++) {
        def entries = changeLogSets[i].items
        for (int j = 0; j < entries.length; j++) {
            def entry = entries[j]
            m = "${m}\n${entry.commitId} by ${entry.author} on ${new Date(entry.timestamp)}:\n\t${entry.msg}"
        }
    }
    return m
}

pipeline {
    

    agent any

    triggers {

        cron('H 9 * * *')

        pollSCM('H/5 * * * *')
    }

    options {
        timeout(time: 120, unit: 'MINUTES') 
        buildDiscarder(logRotator(numToKeepStr: '20'))
        //disableConcurrentBuilds()
    }

    stages {
         
            stage("Automation Preparation"){
                 steps{
                    script{
                        try{
                            sh "npm run clean-test-log"
                        }catch(e){
                            echo "no test logs"
                        }
                    }
                    echo "copy test_config file into workspace"
                    sh "cp $HOME/local_ci/resources/test_config.json test_config.json"
                    copyArtifacts excludes: 'si-mainnet-linux-x64-*.tar.xz', filter: 'si-amity-linux-x64-*.tar.xz', fingerprintArtifacts: true, projectName: 'staking-interface', selector: lastSuccessful(), target: 'aion_staking_interface'
                    dir("aion_staking_interface"){
                        sh "tar -xf si-amity*.tar.xz";
                        sh "ls"
                        echo "${env.NODE_12}"
                    }
                }
            }
            stage("Fetch qa-selenium repo"){
                 steps{
checkout([$class: 'GitSCM', branches: [[name: '*/refactoring']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'MiaoShi09', url: 'https://github.com/MiaoShi09/qa-selenium.git']]])               }
            }

            stage("Install Dependence and run test"){
                 steps{
                    script{
                        withEnv(["PATH=${env.RESOURCES}/chromedriver:${env.WORKSPACE}/node_modules/.bin:${env.NODE_12}:${env.PATH}"]){
                            echo "check node version expected to be 12"
                            sh "node --version"
                            echo "check path"
                            sh "echo $PATH"
                            sh 'npm install'
                            echo "check chromedriver version"
                            sh "chromedriver73 --version"
                            sh "nohup chromedriver73 --verbose > chromedriver73.log 2>&1 &"

                            script{
                                try{
                                   sh 'mocha --file=./test/electron.setup.js --no-timeouts'
                                }catch(Exception e){
                                    echo "this is not stable"
                                    currentBuild.result = 'UNSTABLE'
                                }
                            }

                        }
                    }
                }
            }

    }
    post{
        always{
            script {
                //a GString like "${my_var}" and some class expects String. It can't be cast automatically.
                //If you have some code like this, you have to convert it to String like this: "${my_var}".toString()
                message = getCommit().toString();
            }

            junit 'test_reports/*.xml'
            archiveArtifacts artifacts: 'aion_staking_interface/*.tar.xz,test_logs*/*.*,test_reports/*.xml',fingerprint:true
            
        }

        success{
            
            slackSend channel: '#shanghai_ci',
                      color: 'good',
                      message: "${currentBuild.fullDisplayName} completed successfully. Grab the generated builds at ${env.BUILD_URL}\nArtifacts: ${env.BUILD_URL}artifact/ \n${rpcResult} \n Check BenchTest result: ${env.BUILD_URL}artifact/test_results/report.html \nCommit: ${latest_commit}\nChanges:${message}"
       }
        unstable{
            slackSend channel: '#shanghai_ci',
                      color: 'warning',
                      message: "${currentBuild.fullDisplayName} completed unstable. Grab the generated builds at ${env.BUILD_URL}\nArtifacts: ${env.BUILD_URL}artifact/ \n${rpcResult} \n Check BenchTest result: ${env.BUILD_URL}artifact/test_results/report.html \nCommit: ${latest_commit}\nChanges:${message}"
        }


        failure {
           

            slackSend channel: '#shanghai_ci',
                      color: 'danger', 
                      message: "${currentBuild.fullDisplayName} failed at ${env.BUILD_URL}\n${rpcResult}\nCommit: ${latest_commit}\nChanges:${message}"
        }
    }
}