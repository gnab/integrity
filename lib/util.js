exports.readData = function (stream, callback) {
  var data = '';

  stream.on('data', function (chunk) {
    data += chunk;
  });
  stream.on('end', function () {
    callback(data);
  });
};

exports.parseCommonOptions = function (argv) {
  var options = {}
    , i
    ;

  for (i = 0; i < argv.length; ++i) {
    if (argv[i] === '-p') {
      if (!argv[i+1]) {
        console.error('Missing port number argument to -p option.');
        return null;
      }

      options.port = parseInt(argv[i+1], 10);

      if (options.port === NaN || '' + options.port !== argv[i+1]) {
        console.error('Invalid port: %s', argv[i+1]);
        return null;
      }

      argv.splice(i, 2);
      --i;
    }
  }

  return options;
};
