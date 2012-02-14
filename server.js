var http = require('http')
  , url = require('url')
  , qs = require('querystring')
  , fs = require('fs')
  , EventEmitter = require('events').EventEmitter
  , emitter = new EventEmitter()
  ;
  
http.createServer(handleRequest).listen(5000);

function handleRequest(req, res) {
  var path = url.parse(req.url).pathname
    , method = req.method
    , body = ''
    , post
    ;

  if (path === '/capture') {
    fs.readFile('capture.html', function (err, data) {
      res.setHeader('Content-type', 'text/html');
      res.end(data);
    });
  }
  else if (path === '/test' && method === 'POST') {
    req.on('data', function (data) {
      body += data;
    });
    req.on('end', function () {
      emitter.emit('test', body);
      emitter.on('result', function (result) {
        res.end(result);
      });
    });
  }
  else if (path === '/run') {
    emitter.on('test', function (test) {
      res.setHeader('Content-type', 'text/json');
      res.end(JSON.stringify({test: test}));
    });
  }
  else if (path === '/result') {
    req.on('data', function (data) {
      body += data;
    });
    req.on('end', function () {
      emitter.emit('result', body)
      res.end();
    });
  }
  else {
    res.writeHead(404);
    res.end();
  }
}
