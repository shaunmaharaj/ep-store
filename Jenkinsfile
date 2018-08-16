#!groovy

timestamps {
	ansiColor('xterm') {
		node('node-small') {
			stage('SETUP') {
				deleteDir()
				dir('solrHome') {
					git branch: SOLR_HOME_BRANCH, url: SOLR_HOME_GIT_URL
				}
				dir('scm'){
					checkout scm
				}
			}
			stage('UNDEPLOY_EXISTING') {
				sh """
					ssh -i ${EC2_INSTANCE_SSH_KEY} ${EC2_INSTANCE_USER}@${EC2_INSTANCE_HOST} \"\"\"
					  export REGISTRY_ADDRESS=${DOCKER_REGISTRY_ADDRESS}
					  export STORE_NAMESPACE=${STORE_NAMESPACE}
						export CORTEX_NAMESPACE=${CORTEX_NAMESPACE}
					  export STORE_IMAGE_TAG=${STORE_IMAGE_TAG}
					  export DOCKER_IMAGE_TAG=${DOCKER_IMAGE_TAG}
						export SOLR_HOME_CONFIG=\$(basename ${SOLR_HOME_PATH})
						export CORTEX_IP=${EC2_INSTANCE_HOST}
						export STORE=${STORE_NAME}

					  if [ -d "ref-store-service" ]; then
							if [ ! "\$(docker ps -aq)" ]; then
								cd ref-store-service
								docker-compose down
							fi

							cd ~
					  	rm -rf ref-store-service
					  fi
					\"\"\"
				"""
			}
			stage('DEPLOY') {
				sh """
					ssh -i ${EC2_INSTANCE_SSH_KEY} ${EC2_INSTANCE_USER}@${EC2_INSTANCE_HOST} "mkdir -p ref-store-service"
				"""

				// Copy over new deployment files
				sh """
					scp -i ${EC2_INSTANCE_SSH_KEY} -r scm/* ${EC2_INSTANCE_USER}@${EC2_INSTANCE_HOST}:~/ref-store-service
					scp -i ${EC2_INSTANCE_SSH_KEY} -r ${env.WORKSPACE}/solrHome/${SOLR_HOME_PATH} ${EC2_INSTANCE_USER}@${EC2_INSTANCE_HOST}:/ep
				"""

				// Deploy new version
				sh """
					ssh -i ${EC2_INSTANCE_SSH_KEY} ${EC2_INSTANCE_USER}@${EC2_INSTANCE_HOST} \"\"\"
					  export REGISTRY_ADDRESS=${DOCKER_REGISTRY_ADDRESS}
					  export STORE_NAMESPACE=${STORE_NAMESPACE}
						export CORTEX_NAMESPACE=${CORTEX_NAMESPACE}
					  export STORE_IMAGE_TAG=${STORE_IMAGE_TAG}
					  export DOCKER_IMAGE_TAG=${DOCKER_IMAGE_TAG}
						export SOLR_HOME_CONFIG=\$(basename ${SOLR_HOME_PATH})
						export CORTEX_IP=${EC2_INSTANCE_HOST}
						export STORE=${STORE_NAME}

					  cd ref-store-service
					  eval '\$(aws ecr get-login --no-include-email)'
					  docker-compose up -d
					\"\"\"
				"""

				currentBuild.description = "Image Tag: ${DOCKER_IMAGE_TAG}"
			}
		}
	}
}
