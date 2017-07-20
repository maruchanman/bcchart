FROM node:alpine
MAINTAINER kadoya

COPY build /build
WORKDIR build

RUN npm i --global http-server

EXPOSE 8080

CMD hs
