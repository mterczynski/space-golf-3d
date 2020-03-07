pipeline {
	agent any

	stages {
		stage('Install') {
			steps{
				sh '''
					yarn
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
					scp -r bundle.js root@mterczynski.pl:/var/www/html/gravitee
					scp -r index.html root@mterczynski.pl:/var/www/html/gravitee
					scp -r css root@mterczynski.pl:/var/www/html/gravitee
				'''
			}
		}
	}
}
