FROM node:20-slim

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile
RUN yarn remove bcrypt && yarn add bcrypt --force

COPY . .

EXPOSE 8001

CMD ["yarn", "start:dev"]
