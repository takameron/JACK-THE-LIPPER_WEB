# JACK-THE-LIPPER_WEB

> F team | Web IoT Makers Challenge 2019-20 in Shinshu

## Build Setup
Create a file called `env.development.js`, `env.production.js` by copying `env.sample.js`.
Then, replace the value in the copied file with the actual value.
If you do not define `BASIC_PASSWORD`, Basic Authentication doesn't be performed.

``` bash
# install dependencies
$ yarn install

# migrate
$ node_modules/.bin/sequelize db:migrate --env development

# if you want to migrate for all environment
$ node_modules/.bin/sequelize db:migrate

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

### Basic Authentication
If `BASIC_PASSWORD` is defined in `env.development.js` or `env.production.js`, Basic Authentication will be performed.

* ID : `username`
* Password : `BASIC_PASSWORD` value in `env.*.js`

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
