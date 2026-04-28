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
        SCANNER_HOME = tool 'SonarQube-Scanner'
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

        stage('🔍 SAST (Static Analysis)') {
            steps {
                echo '=== Stage: SAST Analysis (Team Member 4) ==='
                /* 
                   Implementation Strategy (Lab 6B):
                   Run SonarQube right after checkout to find code flaws 
                   before building images
                */
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