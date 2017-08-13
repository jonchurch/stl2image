# POV-Ray

FROM node:boron

RUN \
  date && apt-get update && apt-get -y install \
  build-essential git zlib1g-dev libpng-dev libjpeg-dev libtiff-dev libboost-thread-dev autoconf

RUN \
  mkdir /src && \
  cd /src && \
  git clone https://github.com/POV-Ray/povray.git && \
  cd povray/unix && \
  ./prebuild.sh && \
  cd .. && \
  ./configure COMPILED_BY="Jon Church me@jonchurch.com" && \
  make && \
  make install && \
  date

WORKDIR /usr/src/app

COPY package.json .

COPY . . 

EXPOSE 8080

CMD ["npm", "start"]
