# Typescript based service

A template service repository made in NodeJS / TypeScript using the Express server.

## Requirements

This project requires NodeJS (version 18 or later), NPM (version 7 or later) and AWSSSO CLI. To make sure you have them available on your machine, try running the following commands.

`npm -v`

`node -v`

`aws-sso version`

## Running locally:

### Environment variables

Create a `.env` file (based on `.env.template`)

### Authenticating codeartifact

This relies on AWS Codeartifact. IF you have aws-sso and jsq-cli-zsh installed (https://junipersquare.atlassian.net/wiki/spaces/ENG/pages/1739096212/Configuring+AWS+SSO):

- log in to aws-sso Junipersquare Dev account
- run `login_npm`

### Building, Testing, and Linting service

Install all dependencies - `yarn` (already packaged with pnp)

To build - `yarn build`

To run tests (no tests in this repo yet) - `yarn test`

To lint - `yarn lint`

### Updating core lib dependency

jsq-lib-core package is published as a private package to JSQ AWS CodeArtifact (in npm-composite). Assuming you want to upgrade to the latest version(x.yz) of the package:

`yarn add @jsq/jsq-lib-core@x.yz`

### Running service

`yarn start`

### Accessing the service

The service can be accessed at http://localhost:8080

The open api docs can be accessed at http://localhost:8080/docs

The healthchecks can be accessed at:

- Liveness: http://localhost:8080/liveness

- Readiness: http://localhost:8080/readiness

Metrics can be accessed at http://localhost:8081/metrics

### Docker Build

`docker buildx build . --progress=plain`
