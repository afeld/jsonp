# Copied from https://github.com/heroku/docker-nodejs/blob/63344e66f6cd21050d08438fef10856bcb125898/Dockerfile, since the Node version was hard-coded to 0.12.2, and we need 4.0+.
# https://github.com/heroku/docker-nodejs/issues/2

# Inherit from Heroku's stack
FROM heroku/cedar:14

# Internally, we arbitrarily use port 3000
ENV PORT 3000
# Which version of node?
ENV NODE_ENGINE 5.0.0
# Locate our binaries
ENV PATH /app/heroku/node/bin/:/app/user/node_modules/.bin:$PATH

# Create some needed directories
RUN mkdir -p /app/heroku/node /app/.profile.d
WORKDIR /app/user

# Install node
RUN curl -s https://s3pository.heroku.com/node/v$NODE_ENGINE/node-v$NODE_ENGINE-linux-x64.tar.gz | tar --strip-components=1 -xz -C /app/heroku/node

# Export the node path in .profile.d
RUN echo "export PATH=\"/app/heroku/node/bin:/app/user/node_modules/.bin:\$PATH\"" > /app/.profile.d/nodejs.sh

ADD package.json /app/user/
RUN /app/heroku/node/bin/npm install
ADD . /app/user/
