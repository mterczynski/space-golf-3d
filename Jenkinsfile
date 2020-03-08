pipeline {
	agent any

	environment {
    DESTINATION = "root@mterczynski.pl:/var/www/html/gravitee"
  }

	stages {
		stage('Install') {
			steps{
				sh '''
					yarn
				'''
			}
		}

		stage('TSLint') {
			steps {
				sh '''
					yarn lint
				'''
			}
		}

		stage('Tests') {
			steps {
				sh '''
					yarn test
				'''
			}
		}

		stage('Build') {
			steps {
				sh '''
					yarn build
				'''
			}
		}

		stage('Deploy') {
			steps {
				sh '''
					scp -r dist ${DESTINATION}
					scp -r index.html ${DESTINATION}
					scp -r css ${DESTINATION}
					scp -r assets ${DESTINATION}
				'''
			}
		}
	}
}
