var http = require('http')
  , url = require('url')
  , fs = require('fs')
  , path = require('path')
  , now = require('now')
  , util = require('./util')
  ;

exports.run = function (code, options, callback) {
  var request;

  if (!callback && typeof options === 'function') {
    callback = options;
  }

  options = mergeOptions(options || {});

  request = http.request(options, function (response) {
    response.setEncoding('utf8');
    util.readData(response, function (data) {
      callback(undefined, data);
    });
  });

  request.on('error', function (error) {
    callback(error);
  });

  request.write(code);
  request.end();
};

exports.serve = function (options) {
  var html = fs.readFileSync(path.join(__dirname, 'run.html'))
    , server = http.createServer(handleRequest)
    , everyone
    ;

  options = mergeOptions(options || {});

  server.listen(options.port);
  everyone = now.initialize(server);

  function handleRequest(req, res) {
    var path = url.parse(req.url).pathname
      , method = req.method
      ;

    if (path === options.path && method === 'POST') {
      util.readData(req, function (data) {
        if (typeof everyone.now.run !== 'function') {
          res.end('Error: no browsers attached.');
          return;
        }

        everyone.now.run(data, function (result) {
          res.end(JSON.stringify(result));
        });
      });
    }
    else {
      res.end(html);
    }
  }
}
  
function mergeOptions(options) {
  options.host = options.host || 'localhost';
  options.port = options.port || 5000;
  options.path = options.path || '/run';
  options.method = 'POST';

  return options;
}
