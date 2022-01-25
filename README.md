# TUK-API

Development app for testing new API/SPA based T:UK website

## Heroku test postgresql database

### Connect:

```bash
heroku pg:psql postgresql-transparent-57552 --app trigpointing-me
```

### Rotate credentials:

```
heroku pg:credentials:rotate postgresql-transparent-57552 --app trigpointing-me
```

...then update local .env file  
...then update [GCP secrets](https://console.cloud.google.com/security/secret-manager?project=tuk-dev)  
...then redeploy / restart the app

## NPM

### Installation

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
