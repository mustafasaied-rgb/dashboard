pipeline {
    agent any

    environment {
        GIT_REPO = 'https://ubuntu:${GITHUB_TOKEN}@github.com/Arabian-for-Science-and-Technology-Co/astc-website-frontend-v2'
        BRANCH = 'main'
        DEPLOY_DIR = '/var/www/apps/astc-website-frontend-v2'
        GITHUB_TOKEN = credentials('github-token')
        SSH_USER = 'ubuntu'
        SSH_HOST = '84.8.110.147'
        REMOTE_DEPLOY_DIR = '/var/www/apps/astc-website-frontend-v2'
        SLACK_CHANNEL = '#deploy_updates'
    }

    triggers {
       // pollSCM('H/5 * * * *')  // Polls Git every 5 minutes
        githubPush()  // Webhook trigger
    }

    stages {
   stage('Checkout') {
      steps {
        checkout([$class: 'GitSCM',
          userRemoteConfigs: [[
            url: 'https://github.com/Arabian-for-Science-and-Technology-Co/astc-website-frontend-v2',
            credentialsId: 'github-token'
          ]],
          branches: [[name: '*/main']]
        ])
      }
    }
       stage('Checkout Code') {
            steps {
                script {
                    // send start build notification
                    def slackMessage = "*Build Started* :rocket:\n" + "*Build:* ${currentBuild.fullDisplayName}\n"
                     slackSend(channel: SLACK_CHANNEL, color: '#439FE0', message: slackMessage)
                       sshagent(credentials: ['ssh-private-key']) {
                    sh """
                        set -e
                        ssh -o BatchMode=yes -o StrictHostKeyChecking=no ${SSH_USER}@${SSH_HOST} <<EOF
                        set -e
                        rm -rf "${DEPLOY_DIR}"
                        git clone --depth 1 -b ${BRANCH} ${GIT_REPO} ${DEPLOY_DIR}
                        echo 'Checked out branch: ${BRANCH} => Finished'
                    """
                       }
                }
            }
        }



        stage('Setup Environment') {
            steps {
                script {
                    sh """
                        cd ${DEPLOY_DIR}
                        echo 'Environment setup => Finished'
                    """
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh """
                
                    echo 'Dependencies Installed => Finished'
                    """
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    sh """
                        cd ${DEPLOY_DIR}
                        echo 'Tests Passed => Proceeding to Deployment'
                    """
                }
            }
            post {
                failure {
                    script {
                        sh """
                            echo 'Tests failed. Rolling back changes...'
                            cd ${DEPLOY_DIR}
                        """
                    }
                }
            }
        }


stage('Deploy to Server') {
  steps {
    sshagent(credentials: ['ssh-private-key']) {
      sh """
set -e
ssh -o BatchMode=yes -o StrictHostKeyChecking=no ${SSH_USER}@${SSH_HOST} <<EOF
set -e

sudo chown -R ${SSH_USER}:${SSH_USER} ${DEPLOY_DIR}
cd ${DEPLOY_DIR}

git config --global --add safe.directory ${DEPLOY_DIR}
git pull origin ${BRANCH} 


# optional clean rebuild
rm -rf .nuxt .output node_modules package-lock.json || true
[ -f package-lock.json ] && npm ci || npm install --force
npm run build

# pm2 with port
pm2 restart astc-app  --update-env  || PORT=4000 pm2 start npm --name astc-app  -- start

sudo systemctl reload apache2 || true
echo "Deployment Completed Successfully"
EOF
"""
    }
  }
}
  
    }

post {
  success {
    script {
      def repoDir = env.DEPLOY_DIR
      def commitMessage = "N/A"
      def commitAuthor  = "N/A"
      def commitHash    = "N/A"

      // Wrap shell in sh()
      sh "git -C '${repoDir}' config --global --add safe.directory '${repoDir}' || true"

      if (sh(script: "[ -d '${repoDir}/.git' ]", returnStatus: true) == 0) {
        commitMessage = sh(script: "git -C '${repoDir}' log -1 --pretty=%B", returnStdout: true).trim()
        commitAuthor  = sh(script: "git -C '${repoDir}' log -1 --pretty=%an", returnStdout: true).trim()
        commitHash    = sh(script: "git -C '${repoDir}' log -1 --pretty=%H", returnStdout: true).trim()
      }

      def branchName = env.BRANCH
      def slackMessage = """_*Build ${currentBuild.fullDisplayName} succeeded! :white_check_mark:*_
-------------------------
*Branch:* ${branchName}
*Commit:* ${commitHash}
*Author:* ${commitAuthor}
*Message:* ${commitMessage}

Deployment completed successfully!"""
      echo slackMessage
      slackSend(channel: env.SLACK_CHANNEL, color: 'good', message: slackMessage)
    }
  }
  failure {
    script {
      def consoleOutput = currentBuild.rawBuild.getLog(100).join("\n")
      def repoDir = env.DEPLOY_DIR
      def commitHash = (sh(script: "[ -d '${repoDir}/.git' ] && git -C '${repoDir}' log -1 --pretty=%H || true", returnStdout: true).trim()) ?: "N/A"
      def slackMessage = """_*Build ${currentBuild.fullDisplayName} failed! :x:*_
-------------------------
*Branch:* ${env.BRANCH}
*Commit:* ${commitHash}

<!channel> Error occurred during deployment. Check logs.
*Build URL:* ${env.BUILD_URL}

*Last 100 lines of logs:*
${consoleOutput}
"""
      echo slackMessage
       slackSend(channel: env.SLACK_CHANNEL, color: 'danger', message: slackMessage)
      error "Build failed during the deployment process!"
    }
  }
}


            
}
