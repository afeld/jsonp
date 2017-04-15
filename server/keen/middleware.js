const keen = require('./client');

const getCommonEvent = (req) => {
  return {
    method: req.method,
    path: req.path,
    ip: req.ips[0]
  };
};

const registerResponse = (req, res, resEvent, start) => {
  let end = new Date().getTime();
  let resTime = end - start; // milliseconds
  console.log(req);
  console.log(`response time:: ${resTime}ms`);

  const eventData = getCommonEvent(req);
  eventData.event = resEvent;
  eventData.statusCode = res.statusCode;
  eventData.resTime = resTime;

  keen.recordEvent('reqEnd', eventData);
};

module.exports = (req, res, next) => {
  const start = new Date().getTime();

  const event = getCommonEvent(req);
  keen.recordEvent('reqStart', event);

  res.on('close', () => {
    registerResponse(req, res, 'close', start);
  });
  res.on('finish', () => {
    registerResponse(req, res, 'finish', start);
  });

  next();
};
