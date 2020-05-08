# AppToShare Backend  




## Description

This application is the backend of [AppToShare](https://github.com/SReynoso-DEV/AppToShareFrontend).

Our goal is to imporve the current reservation process to make it easier for stuends and also easier to manage, with future proof in mind.

This application was written with the [Nest](https://github.com/nestjs/nest) framework.


## Pre Requisites

* [NodeJS and NPM](https://nodejs.org/en/)
* [Git](https://git-scm.com)
* 500mb of free space

## Installation

```bash
$ git clone https://github.com/FerLuisxd/CubiculosPoolBackend.git
$ cd CubiculosPoolBackEnd/
$ npm install
```

## Running the app

* Before running we first need to setup the enviorment.
So we need to create and .env file in the root folder and add this variables:

.env:
```
MONGO_SRV = 'mongoUrlHere'
JWT_SECRET = 'Ar3allyStrokP4ssworD'
NODE_ENV = development
```

After that we can start the app normally: 

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

You can ask for support on the #Follow the devs section

## Follow the devs


-  [@FerLuisxd](https://twitter.com/ferluisxd)
-  [@PieroQB](https://twitter.com/ferluisxd)
-  [@ZBishop ](https://twitter.com/ferluisxd) 


## License

  This app is [MIT licensed](LICENSE).
