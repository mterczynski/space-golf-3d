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
					scp -r bundle.js ${DESTINATION}/bundle.js
					scp -r index.html ${DESTINATION}/index.html
					scp -r css ${DESTINATION}/css
					scp -r assets ${DESTINATION}/assets
				'''
			}
		}
	}
}
