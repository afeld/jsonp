const cors = require('cors');

module.exports.cors = cors({
  maxAge: 60 * 60 * 24, // one day
  methods: ['GET']
});
