# JACK-THE-LIPPER_WEB

> F team | Web IoT Makers Challenge 2019-20 in Shinshu

## Build Setup
Create a file called `env.development.js`, `env.production.js` by copying `env.sample.js`.
Then, replace the value in the copied file with the actual value.

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

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
