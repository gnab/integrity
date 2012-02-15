var http = require('http')
  , url = require('url')
  , qs = require('querystring')
  , fs = require('fs')
  , uuid = require('node-uuid')
  , runners = []
  , tests = {}
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
  readData(req, function (data) {
    runTest(data, res);
  });
}

function registerRunner(req, res) {
  runners.push({request: req, response: res});
}

function notifyResult(req, res) {
  readData(req, function (data) {
    var test = JSON.parse(data);
    tests[test.id].response.end('' + test.result);
    delete tests[test.id];
    res.end();
  });
}

function readData(req, callback) {
  var data = '';

  req.on('data', function (chunk) {
    data += chunk;
  });
  req.on('end', function () {
    callback(data);
  });
}

function runTest(data, res) {
  var id = uuid.v4()
    , runner
    ;

  tests[id] = {data: data, response: res};

  while (runner = runners.pop()) {
    if (runner.response.finished) {
      continue;
    }
    runner.response.setHeader('Content-type', 'text/json');
    runner.response.end(JSON.stringify({id: id, data: data}));
  }
}
