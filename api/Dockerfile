FROM python:3.5-alpine
MAINTAINER kadoya

RUN apk add --update build-base

COPY . /api
WORKDIR /api

RUN pip3 install -r requirements.txt

CMD python app.py
