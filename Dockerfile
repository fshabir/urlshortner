FROM ubuntu:latest
MAINTAINER furhan.shabir@gmail.com

RUN apt-get update
RUN apt-get install -y nodejs nodejs-legacy npm
RUN apt-get install -y redis-server

COPY ./package.json /urlshortner/

RUN cd urlshortner && npm install

COPY . /urlshortner/

WORKDIR /urlshortner

CMD service redis-server start && node .
