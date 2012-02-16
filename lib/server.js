var http = require('http')
  , url = require('url')
  , fs = require('fs')
  , path = require('path')
  , now = require('now')
  , util = require('./util')
  , html = fs.readFileSync(path.join(__dirname, 'run.html'))
  , server = http.createServer(handleRequest)
  , everyone
  ;

server.listen(5000);
everyone = now.initialize(server);

function handleRequest(req, res) {
  var path = url.parse(req.url).pathname
    , method = req.method
    ;

  if (path === '/test' && method === 'POST') {
    util.readData(req, function (data) {
      everyone.now.run(data, function (result) {
        res.end('' + result);
      });
    });
  }
  else {
    res.end(html);
  }
}
