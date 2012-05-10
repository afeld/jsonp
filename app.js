var express = require('express'),
  jsonp = require('connect-jsonp');

var app = express.createServer();

app.configure(function(){
  app.use(express.logger({format: ':method :url'}));
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(jsonp());
  app.use(app.router);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


var response = {
  success: true,
  it: 'works!'
};

// simple alert, not exactly x-domain...
app.get('/', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<script type="text/javascript" src="/script-tag?callback=alert"></script>');
});

// requested after the script tag is rendered, result is evaluated
app.get('/script-tag', function(req, res) {
  var url = req.param('url');

  if (url){
    // proxy the request
    res.writeHead(200, {'Content-Type': 'application/json'});
    var r = request({url: url});
    r.pipe(res);
  } else {
    
  }
  res.end(JSON.stringify(response));
});

app.listen(3000);
console.log('jsonp server listening on port 3000');
