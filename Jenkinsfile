pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '5', daysToKeepStr: '10'))
        disableConcurrentBuilds() // Avoid Docker port 3000 conflicts
        timeout(time: 1, unit: 'HOURS') // Safety cutoff
        timestamps()
    }

    environment {
        APP_NAME = 'Juice-Vault'
        SONAR_TOKEN = credentials('sonarqube-token')
        SONAR_PROJECT_KEY = 'juice-vault'
        SONAR_PROJECT_NAME = 'Juice Vault'
    }


    stages {
        stage('🏁 Initialize') {
            steps {
                script {
                    currentBuild.displayName = "#${env.BUILD_NUMBER} - ${env.APP_NAME}"
                    currentBuild.description = "Security Analysis Pipeline"
                }
                echo "=== Starting DevSecOps Pipeline for ${env.APP_NAME} ==="
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
                script {
                    echo "=== CHECKOUT STAGE ==="
                    echo "Repository: ${env.GIT_URL}"
                    echo "Commit: ${env.GIT_COMMIT}"
                    echo "Build: #${BUILD_NUMBER}"

                    sh 'ls -la'
                    sh 'git log --oneline -3'
                }
            }
        }

        stage('🔍 SonarQube Analysis') {
            steps {
                script {
                    echo "=== Stage: SAST Analysis (Team Member 4) ==="
                    // 'SonarQube-Local' must match the name configured in Jenkins System settings
                    withSonarQubeEnv('SonarQube-Local') {
                        // Dynamically find the scanner tool configured in Jenkins
                        def scannerHome = tool name: 'SonarQube-Scanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                        
                        sh """
                            export PATH="${scannerHome}/bin:\$PATH"
                            
                            sonar-scanner \
                            -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                            -Dsonar.projectName="${SONAR_PROJECT_NAME}" \
                            -Dsonar.projectVersion=1.0.${env.BUILD_NUMBER} \
                            -Dsonar.sources=. \
                            -Dsonar.exclusions="**/*test*.py,**/venv/**,**/__pycache__/**" \
                            -Dsonar.host.url=\$SONAR_HOST_URL \
                            -Dsonar.login=${SONAR_TOKEN} \
                            -Dsonar.scm.provider=git \
                            -Dsonar.qualitygate.wait=true \
                            -Dsonar.qualitygate.timeout=300
                        """
                    }
                }
            }
        }

        stage('🚦 SAST Quality Gate') {
            steps {
                // Prevents the pipeline from hanging forever if SonarQube is slow
                timeout(time: 10, unit: 'MINUTES') {
                    script {
                        echo "=== QUALITY GATE EVALUATION ==="
                        // This step pauses the pipeline until SonarQube sends the result via Webhook
                        def qg = waitForQualityGate()
                        
                        echo "Quality Gate Status: ${qg.status}"
                        
                        if (qg.status != 'OK') {
                            echo "❌ Quality Gate Failed!"
                            currentBuild.result = 'UNSTABLE'
                        } else {
                            echo "✅ Quality Gate Passed!"
                        }
                    }
                }
            }
        }

        stage('🛠️ Build Image') {
            steps {
                echo '=== Stage: Build Application Image ==='
                // Build the Docker version of Juice Shop
                sh 'docker build -t juice-shop:latest .'
            }
        }

        stage('📦 SCA (Dependency Scan)') {
            steps {
                echo '=== Stage: SCA Scan (Team Member 3) ==='
                /* 
                   Implementation Strategy (Lab 7C):
                   Now that the image is built, use Trivy to scan for 
                   vulnerabilities in both the OS and app libraries
                */
            }
        }

        stage('🚀 Deploy to Staging') {
            steps {
                echo '=== Stage: Deployment for DAST ==='
                // Spin up the live app for dynamic testing
                sh 'docker stop juice-shop-staging || true'
                sh 'docker rm juice-shop-staging || true'
                sh 'docker run -d --name juice-shop-staging -p 3000:3000 juice-shop:latest'
                sleep 20 // Allow app to initialize
            }
        }

        stage('🛡️ DAST (Dynamic Analysis)') {
            steps {
                echo '=== Stage: DAST Scan (Team Member 2) ==='
                /* 
                   Implementation Strategy (Lab 8B):
                   Run ZAP, Nikto, or SQLMap against http://localhost:3000
                */
            }
        }
    }

    post {
        always {
            echo '🧹 Performing Post-Build Cleanup...'
            // Remove containers to free local resources
            sh 'docker stop juice-shop-staging || true'
            sh 'docker rm juice-shop-staging || true'
            
            script {
                // Log completion time for the project report
                def duration = currentBuild.durationString.replace(' and counting', '')
                echo "⏱ Pipeline completed in ${duration}"
            }
        }
        success {
            echo '🎉 Pipeline Succeeded - Security Reports are Ready'
        }
        failure {
            echo '💥 Pipeline Failed - Review Scan Results for Vulnerabilities'
        }
    }
}