const KeenTracking = require('keen-tracking');

const KEEN_PROJECT_ID = process.env.KEEN_PROJECT_ID;
const KEEN_WRITE_KEY = process.env.KEEN_WRITE_KEY;
let client;

if (KEEN_PROJECT_ID && KEEN_WRITE_KEY) {
  client = new KeenTracking({
    projectId: KEEN_PROJECT_ID,
    writeKey: KEEN_WRITE_KEY
  });
  console.log("Keen.io enabled.")
} else {
  console.warn("Keen.io credentials not set - events will not be recorded.");
}

module.exports.recordEvent = (...args) => {
  if (client) {
    client.recordEvent(...args);
  }
}