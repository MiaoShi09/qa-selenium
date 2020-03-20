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
		buildDiscarder(logRotator(numToKeepStr: '10'))
		disableConcurrentBuilds()
    }
    stages {
        stage('run chrome test') {
            steps {
            	sh "./node_modules/.bin/mocha --file=test/chrome.setup.js --no-timeouts"
            }
        }

        stage("run desktop app test"){
        	steps{
        		sh 'nohup ./chromedriver &'
                echo ""
                sh './node_modules/.bin/mocha --file=test/chrome.setup.js --no-timeouts'
                
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
			archiveArtifacts artifacts: 'test_logs*/*.*',fingerprint:true
			
        }

        success{
			//archiveArtifacts artifacts: '*.tar.gz,package/*,target/release/aion',fingerprint:true
	        slackSend channel: '#shanghai_ci',
	                  color: 'good',
	                  message: "${currentBuild.fullDisplayName} completed successfully. Grab the generated builds at ${env.BUILD_URL}\nArtifacts: ${env.BUILD_URL}artifact/ \n${rpcResult} \n Check BenchTest result: ${env.BUILD_URL}artifact/test_results/report.html \nCommit: ${latest_commit}\nChanges:${message}"
       }
		
        failure {
            //cleanWs();

            slackSend channel: '#shanghai_ci',
			          color: 'danger', 
			          message: "${currentBuild.fullDisplayName} failed at ${env.BUILD_URL}\n${rpcResult}\nCommit: ${latest_commit}\nChanges:${message}"
        }
    }
}