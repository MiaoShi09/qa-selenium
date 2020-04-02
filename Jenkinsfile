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
        cron('H 23 * * *')
        pollSCM('H/5 * * * *')
    }

    options {
        timeout(time: 120, unit: 'MINUTES') 
        buildDiscarder(logRotator(numToKeepStr: '20'))
        //disableConcurrentBuilds()
    }

    stages {
        
            stage('fetch si repo') {
                steps {
                    dir("aion_staking_interface"){
                         checkout([$class: 'GitSCM',
                            branches: [[name: '*/si']],
                            extensions: [[$class: 'CloneOption', timeout: 20]],
                            gitTool: 'Default', 
                            userRemoteConfigs: [[credentialsId: '91d339de-e166-410f-901e-65a91e09a190',url: 'https://github.com/aionnetwork/aion_staking_interface.git']]
                        ]);
                     }

                }
            }

            stage("build si and unzip package"){
                steps{
                    script{
                        withEnv("PATH=${env.NODE10}:${env.PATH}"){
                            dir("aion_staking_interface"){
                                sh 'npm install'
                                sh 'TEST_MODE=true ./package-linux-x64.sh'
                                sh 'tar -xf si-amity-linux-x64-*.tar.xz'
                            }
                        }
                    }
                }
            }

        

        
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
                }
            }
            stage("Fetch qa-selenium repo"){
                 steps{
                     checkout([$class: 'GitSCM',
                        branches: [[name: '*/refactoring']],
                        extensions: [[$class: 'CloneOption', timeout: 20]],
                        gitTool: 'Default', 
                        userRemoteConfigs: [[url: 'https://github.com/MiaoShi/qa-selenium.git']]
                    ]);
                 }
            }

            stage("Install Dependence and run test"){
                 steps{
                    script{
                        withEnv("PATH=${env.PWD}/node_modules/.bin:${env.NODE12}:${env.PATH}"){
                            sh 'npm install'
                            echo "check chromedriver version"
                            sh "chromedriver73 --version"
                            sh "nohup chromedriver73 --verbose > chromedriver73.log 2>&1 &"
                            sh 'mocha --file=./test/electron.setup.js --no-timeouts'
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
            archiveArtifacts artifacts: 'aion_staking_interface/*.tar.xz,test_logs*/*.*',fingerprint:true
            
        }

        success{
            //archiveArtifacts artifacts: '*.tar.gz,package/*,target/release/aion',fingerprint:true
            slackSend channel: '@Miao',
                      color: 'good',
                      message: "${currentBuild.fullDisplayName} completed successfully. Grab the generated builds at ${env.BUILD_URL}\nArtifacts: ${env.BUILD_URL}artifact/ \n${rpcResult} \n Check BenchTest result: ${env.BUILD_URL}artifact/test_results/report.html \nCommit: ${latest_commit}\nChanges:${message}"
       }
        
        failure {
            //cleanWs();

            slackSend channel: '@Miao',
                      color: 'danger', 
                      message: "${currentBuild.fullDisplayName} failed at ${env.BUILD_URL}\n${rpcResult}\nCommit: ${latest_commit}\nChanges:${message}"
        }
    }
}