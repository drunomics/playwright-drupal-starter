#!/usr/bin/env bash

# Copy the results and report from container before removing
# Publish report on cloudflare
# Make sure to remove container even if something fails
trap 'echo "Removing playwright container..." &&
      docker cp $(docker compose -f $VCS_DIR/docker/service-playwright.yml ps -q playwright):/e2e/html-report html-report
      docker cp $(docker compose -f $VCS_DIR/docker/service-playwright.yml ps -q playwright):/e2e/test-results test-results
      docker compose -f $VCS_DIR/docker/service-playwright.yml exec -T playwright sh -c \
         "wrangler pages publish --project-name=playwright-report --branch=$GIT_SAFE_BRANCH /e2e/html-report"
      docker compose -f $VCS_DIR/docker/service-playwright.yml  rm -sfv playwright' EXIT

set -e
cd `dirname $0`
VCS_DIR=../..

# Prepare environment.
# Add needed variables to .env file.
# echo "VAR_NAME=VAR_VALUE" > .env

# Prepare playwright configuration.
export HTTP_AUTH_USER=
export HTTP_AUTH_PASS=
export BASE_URL=

# Replaces variables in playwright config template file and creates actual configuration.
$VCS_DIR/scripts/util/replace-vars.sh < playwright.envsubst.config.js > playwright.config.js

# Detect environment. Adjust as needed.
# In local environment we run playwright on local machine directly.
# In a CI environment we run dockerized playwright.
if [[ $ENV == 'local' ]]
then
  # When drupal is dockerized we need to prepare command to execute drush in the container.
  export CLI_CONTAINER=
  echo DOCKER_EXEC_CLI="docker exec ${CLI_CONTAINER} bash -c" >> .env
  npm install
  npx playwright install
  npx playwright test $1
else
  docker compose -f $VCS_DIR/docker/service-playwright.yml up -d playwright
  docker compose -f $VCS_DIR/docker/service-playwright.yml exec -T playwright sh -c \
   'npx playwright test'
fi
