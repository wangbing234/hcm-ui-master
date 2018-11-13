pipeline {
    agent{
		  label 'master'
	  }
    options {
        buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '10', numToKeepStr: '200')
        disableConcurrentBuilds()
        skipStagesAfterUnstable()
        timeout(10)
    }
    parameters {
        booleanParam defaultValue: false, description: '部署uat', name: 'uat'
    }
    environment {
        scannerHome = tool 'sonarscanner'
    }
	  stages{
		  stage('拉取代码'){
			  steps{
				  script{
				      echo "更新代码"
				    git branch: "master", credentialsId: '1', url: 'https://github.com/100offer/hcm-ui.git'
				  }
		    }
	    }
      stage('测试'){
          steps{
              script{
                sh 'sudo /usr/bin/npm install && sudo /usr/bin/npm test'
      		    }
      	  }
      }
      stage('质量检查'){
        steps{
          script{
            sh '/usr/bin/npm run-script sonar-scanner'
            def ceTaskId = sh(returnStdout: true ,script: "cat .scannerwork/report-task.txt | cut -d '=' -f 2 |sed -n '5p'").trim()
            def ceTaskUrl = sh(returnStdout: true ,script: "cat .scannerwork/report-task.txt | cut -d '=' -f 2 |sed -n '6p'").trim()
            echo "${ceTaskId}+${ceTaskUrl}"
          }
        }
      }
      stage('部署local'){
          steps{
             script{
                sh 'sudo /usr/bin/npm run buildApp -- --env=local && sudo /usr/bin/npm run deploy -- --env=local'
             }
          }
      }
      stage('部署dev'){
          steps{
             script{
                sh 'sudo /usr/bin/npm run buildApp -- --env=dev && sudo /usr/bin/npm run deploy -- --env=dev'
             }
          }
      }
      stage('部署uat'){
          steps{
             script{
                if(params.uat){
                   sh 'sudo /usr/bin/npm run buildApp -- --env=uat && sudo /usr/bin/npm run deploy -- --env=uat'
                }
             }
          }
      }
    }
    post {
      always {
          sendDD("${currentBuild.currentResult}")
      }
    }
}
@NonCPS
def getChangeString() {
 MAX_MSG_LEN = 100
 def changeString = ""

 echo "Gathering SCM changes"
 def changeLogSets = currentBuild.changeSets
 for (int i = 0; i < changeLogSets.size(); i++) {
 def entries = changeLogSets[i].items
 for (int j = 0; j < entries.length; j++) {
 def entry = entries[j]
 truncated_msg = entry.msg.take(MAX_MSG_LEN)
 changeString += " - ${truncated_msg} [${entry.author}]\n"
 }
 }

 if (!changeString) {
 changeString = " - No new changes"
 }
 return changeString
}

def sendDD(status) {
    def image = 'red.png'
    if(status == 'SUCCESS'){
        image = 'blue.png'
    }
    dingTalk accessToken: '90b367795a9c68bda3a8021488bcfc1f854b44f5ef9ca820cdb7b2dbe13a4f1f', imageUrl: "http://47.102.20.44:8080/static/b570d509/images/32x32/${image}", jenkinsUrl: 'http://47.102.20.44:8080/', message: "Changes:\n " + getChangeString(), notifyPeople: ''
}
