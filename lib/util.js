exports.readData = function (stream, callback) {
  var data = '';

  stream.on('data', function (chunk) {
    data += chunk;
  });
  stream.on('end', function () {
    callback(data);
  });
}
