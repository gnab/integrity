var http = require('http')
  , url = require('url')
  , qs = require('querystring')
  , fs = require('fs')
  , EventEmitter = require('events').EventEmitter
  , emitter = new EventEmitter()
  , util = require('util')
  ;
  
http.createServer(handleRequest).listen(5000);

function handleRequest(req, res) {
  var path = url.parse(req.url).pathname
    , method = req.method
    ;

  if (path === '/capture') {
    captureBrowser(req, res);
  }
  else if (path === '/test' && method === 'POST') {
    scheduleTest(req, res);
  }
  else if (path === '/run') {
    awaitTest(req, res);
  }
  else if (path === '/result') {
    notifyResult(req, res);
  }
  else {
    res.writeHead(404);
    res.end();
  }
}

function captureBrowser(req, res) {
  fs.readFile('capture.html', function (err, data) {
    res.setHeader('Content-type', 'text/html');
    res.end(data);
  });
}

function scheduleTest(req, res) {
  var body = '';

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

function awaitTest(req, res) {
  emitter.once('test', function (test) {
    res.setHeader('Content-type', 'text/json');
    res.end(JSON.stringify({test: test}));
  });
}

function notifyResult(req, res) {
  var body = '';

  req.on('data', function (data) {
    body += data;
  });
  req.on('end', function () {
    emitter.emit('result', body)
    res.end();
  });
}
