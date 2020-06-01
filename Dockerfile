FROM node:alpine

WORKDIR /opt/app

COPY package*.json ./

RUN npm i --quiet

COPY ./src .

CMD node ./src/index.js
