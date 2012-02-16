var http = require('http')
  , url = require('url')
  , fs = require('fs')
  , now = require('now')
  , html = fs.readFileSync('run.html')
  , server = http.createServer(handleRequest)
  , everyone
  ;

server.listen(5000);
everyone = now.initialize(server);

function handleRequest(req, res) {
  var path = url.parse(req.url).pathname
    , method = req.method
    ;

  if (path === '/') {
    res.end(html);
  }
  else if (path === '/test' && method === 'POST') {
    readData(req, function (data) {
      everyone.now.run(data, function (result) {
        res.end('' + result);
      });
    });
  }
  else {
    res.writeHead(404);
    res.end();
  }
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
