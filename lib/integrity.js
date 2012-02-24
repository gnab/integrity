var http = require('http')
  , url = require('url')
  , fs = require('fs')
  , path = require('path')
  , dnode = require('dnode')
  , util = require('./util')
  ;

exports.run = function (code, options, callback) {
  var request;

  if (!callback && typeof options === 'function') {
    callback = options;
  }

  options = mergeOptions(options || {});

  var connection = dnode.connect(options.host, options.internalPort, function (server) {
    server.run(code, function (error, result) {
      callback(error, result);
      connection.end();
    });
  });
};

exports.serve = function (options) {
  var html = fs.readFileSync(path.join(__dirname, 'run.html'))
    , server = http.createServer(function (req, res) {
      if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
      }
    })
  , clients = {}
  ;

  options = mergeOptions(options || {});

  server.listen(options.port);

  dnode(function (client, connection) {
    connection.on('ready', function () {
      if (client.run) {
        clients[connection.id] = client.run;
      }
    });
    connection.on('end', function () {
      if (client.run) {
        delete clients[connection.id];
      }
    });
  }).listen(server);

  dnode({
    run: function (code, callback) {
      for (var id in clients) {
        if (!clients.hasOwnProperty(id)) {
          return;
        }
        clients[id](code, callback);
      }
    }
  }).listen(options.host, options.internalPort);
}

function mergeOptions(options) {
  options.host = options.host || 'localhost';
  options.port = options.port || 5000;
  options.internalPort = 5001;

  return options;
}
