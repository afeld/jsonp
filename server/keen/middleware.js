const keen = require('./client');

const registerResponse = (req, res, event, start) => {
  let end = new Date().getTime();
  let resTime = end - start; // milliseconds
  console.log(req);
  console.log(`response time:: ${resTime}ms`);

  keen.recordEvent('reqEnd', {
    event: event,
    method: req.method,
    path: req.path,
    statusCode: res.statusCode,
    resTime: resTime,
    ip: req.ips[0]
  });
};

module.exports = (req, res, next) => {
  let start = new Date().getTime();

  keen.recordEvent('reqStart', {
    method: req.method,
    path: req.path,
    ip: req.ips[0]
  });

  res.on('close', () => {
    registerResponse(req, res, 'close', start);
  });
  res.on('finish', () => {
    registerResponse(req, res, 'finish', start);
  });
  next();
};
