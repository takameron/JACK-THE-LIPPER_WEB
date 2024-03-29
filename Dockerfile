FROM node:12-alpine as base

WORKDIR /usr/local/JACK-THE-LIPPER
COPY . .
RUN yarn install
EXPOSE 3000

FROM base as development
CMD ash -c "node_modules/.bin/sequelize db:migrate --env development  &&  yarn dev"

FROM base as production
RUN yarn build
CMD ash -c "node_modules/.bin/sequelize db:migrate --env production  &&  yarn start"