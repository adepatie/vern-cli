# Vern Trusted Image
# Based on Ubuntu 14.04, Mongo 2.6.x, Node 0.10.x

FROM ubuntu:14.04
MAINTAINER typefoo <hello@typefoo.com>

RUN useradd -ms /bin/bash ubuntu
RUN cd && cp -R .bashrc .profile /home/ubuntu

RUN chown -R ubuntu:ubuntu /home/ubuntu

RUN \
  apt-get -y update && \
  apt-get install -y software-properties-common build-essential && \
  add-apt-repository -y ppa:chris-lea/node.js && \
  apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 && \
  echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | tee /etc/apt/sources.list.d/mongodb.list && \
  apt-get -y update && \
  apt-get install -y nodejs mongodb-org && \
  mkdir -p /data/db && \
  npm install -g vern-cli

USER ubuntu
ENV HOME /home/ubuntu

RUN cd /home/ubuntu && vern create project vern-test -y

VOLUME ["/data/db", "/home/ubuntu"]

WORKDIR /home/ubuntu/vern-test

ADD ./docker /home/ubuntu/docker

CMD ["/home/ubuntu/docker/start"]

EXPOSE 3458 9000 9001 27017 28017
