const config = require('./webpack.config.js');
const dotenv = require('dotenv');
const fs = require('fs');
const fetch = require('node-fetch');
const util = require('util');
const webpack = require('webpack');

dotenv.load();

const CLOUDFLARE_EMAIL = process.env.CLOUDFLARE_EMAIL;
const CLOUDFLARE_KEY = process.env.CLOUDFLARE_KEY;
const headers = {
  'X-Auth-Email': CLOUDFLARE_EMAIL,
  'X-Auth-Key': CLOUDFLARE_KEY
};
const CLOUDFLARE_ZONE = process.env.CLOUDFLARE_ZONE || 'afeld.me';

// based on
// https://webpack.js.org/api/node/
async function build() {
  const webpacker = util.promisify(webpack);
  const stats = await webpacker(config);
  if (stats.hasErrors()) {
    throw 'Error in webpack';
  }
  const output = stats.toString({ colors: true });
  console.log(output);
}

async function getZoneId() {
  const url = `https://api.cloudflare.com/client/v4/zones?name=${CLOUDFLARE_ZONE}`;
  const req = await fetch(url, { headers });
  const data = await req.json();
  return data.result[0].id;
}

async function uploadWorker(zoneId, filename) {
  const body = fs.createReadStream(filename);
  const url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/workers/script`;
  const res = await fetch(url, {
    body,
    headers: { ...headers, 'content-type': 'application/javascript' },
    method: 'PUT'
  });
  if (!res.ok) {
    throw res;
  }
}

Promise.all([build(), getZoneId()])
  .then(([buildResult, zoneId]) => {
    // TODO get path dynamically
    return uploadWorker(zoneId, 'dist/main.js');
  })
  .then(() => {
    console.log('Upload complete.');
  })
  .catch(err => {
    console.error(err.message || err);
    process.exit(1);
  });
