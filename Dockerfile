FROM heroku/nodejs

# Need to re-install Node, since the version is hard-coded (to 0.12.2) in the base image.
# https://github.com/heroku/docker-nodejs/issues/2
ENV NODE_ENGINE 5.0.0
RUN curl -s https://s3pository.heroku.com/node/v$NODE_ENGINE/node-v$NODE_ENGINE-linux-x64.tar.gz | tar --strip-components=1 -xz -C /app/heroku/node

WORKDIR /app/user
CMD npm start
