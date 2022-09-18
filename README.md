# Playwright drupal starter

This repository contains basic playwright setup together with scripts and commands to ease writing tests with a drupal project.

## Introduction

We assume the drupal project used is based on [drupal recommended project](https://github.com/drupal/recommended-project)
Under tests/playwright you will find playwright setup as standalone node.js project.
Included is a run.sh script which is used to simplify environment setup and to combine local and setup on a CI system.

Under drush/ directory you will find custom drush commands used to ease testing with drupal. 
On example, there are commands to quickly create new content by cloning existing, or a command to cleanup content created during tests.

In the docker directory you will find docker-compose and dockerfile - files which are used to dockerize a playwright project.
This way we make it easy to run playwright tests on a CI system.
Prepared docker setup includes:
- dotenv package
- wrangler package - as a way to publish html reports generated on a CI to cloudflare
- docker-ce-cli package - in case both drupal and playwright are dockerized, we need a way to execute drush commands from playwright container in drupal container
  - we setup a docker socket. See volumes section of service-playwright.yml

## Instructions 

Copy the contents of this repo into your project.
Adjust the needed variables:
- in tests/playwright/run.sh adjust 
  - BASE_URL -> set to url of your project
  - HTTP_AUTH_USER and HTTP_AUTH_PASS -> if your site is protected with basic auth
  - CLI_CONTAINER (and DOCKER_EXEC_CLI)-> if your drupal instance is dockerized, adjust this variable to the name of the drupal container where drush commands can be executed
  - adjust the detection of local environment. THe script assumes the existance of ENV variable set to "local" in a local environment.
  - feel free to adjust the script as needed

If you wish to use dockerized playwright instance, adjust the variables in docker/service-playwright.yml accordingly.
We included some helpers (tests/playwright/tests/helpers) and some initial example tests (tests/playwright/tests/)

For further assistance on setting up the playwright tests with drupal,feel free to post an issue.
Please refer to [the official playwright documentation](https://playwright.dev/docs/intro) for help about playwright tests.
