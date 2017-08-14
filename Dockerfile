# POV-Ray

FROM node:7

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

RUN mkdir /usr/src/app/file_db && mkdir /usr/src/app/file_db/stl /usr/src/app/file_db/png \
	&& npm install

EXPOSE 80

CMD ["npm", "start"]
