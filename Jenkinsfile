pipeline {
	agent any

	environment {
    DESTINATION = "root@mterczynski.pl:/var/www/html/space-golf-3d"
  }

	stages {
		stage('Install') {
			steps{
				sh '''
					npm install
				'''
			}
		}

		stage('TSLint') {
			steps {
				sh '''
					npm run lint
				'''
			}
		}

		stage('Tests') {
			steps {
				sh '''
					npm run test
				'''
			}
		}

		stage('Build') {
			steps {
				sh '''
					npm run build
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
