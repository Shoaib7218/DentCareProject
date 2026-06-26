pipeline {
    agent any

    tools {
        maven 'Maven_mvn'
        jdk 'Java_jdk_21'
    }

    stages {
        stage('Checkout App') {
            steps {
                dir('dentcare-app') {
                    git branch: 'master', url: 'https://github.com/Shoaib7218/DentCareProject.git'
                }
            }
        }

        stage('Checkout Tests') {
            steps {
                dir('dentcare-tests') {
                    git branch: 'main', url: 'https://github.com/Shoaib7218/DentCare_login_test_jenkins_git.git'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('dentcare-tests') {
                    bat 'mvn clean test'
                }
            }
        }
    }

    post {
        always {
            junit 'dentcare-tests/target/surefire-reports/*.xml'
        }
    }
}