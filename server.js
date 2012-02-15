var http = require('http')
  , url = require('url')
  , qs = require('querystring')
  , fs = require('fs')
  , EventEmitter = require('events').EventEmitter
  , emitter = new EventEmitter()
  , runners = []
  ;
  
http.createServer(handleRequest).listen(5000);

emitter.on('test', runTest);

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
    registerRunner(req, res);
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

function registerRunner(req, res) {
  runners.push({request: req, response: res});
  console.log('Added runner.');
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

function runTest(test) {
  var runner;

  console.log('Running test on %d runners...', runners.length);

  while (runner = runners.pop()) {
    runner.response.setHeader('Content-type', 'text/json');
    runner.response.end(JSON.stringify({test: test}));
  }
}
