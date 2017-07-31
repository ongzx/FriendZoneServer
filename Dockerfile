FROM node:boron
MAINTAINER Chi Hi Ong <xier.ongzx@gmail.com>

WORKDIR /usr/src/friendzone

COPY package.json .

RUN npm install -g sequelize-cli
RUN npm install -g gulp
RUN npm install -g pm2
RUN npm install

COPY . .

RUN gulp default

EXPOSE 3000