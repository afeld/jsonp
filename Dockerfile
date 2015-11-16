# Copied from https://github.com/heroku/docker-nodejs/blob/63344e66f6cd21050d08438fef10856bcb125898/Dockerfile, since the Node version was hard-coded to 0.12.2, and we need 4.0+.
# https://github.com/heroku/docker-nodejs/issues/2

FROM heroku/nodejs

ENV NODE_ENGINE 5.0.0
# Install node
RUN curl -s https://s3pository.heroku.com/node/v$NODE_ENGINE/node-v$NODE_ENGINE-linux-x64.tar.gz | tar --strip-components=1 -xz -C /app/heroku/node
