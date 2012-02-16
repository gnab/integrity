var path = require('path')
  , fs = require('fs')
  , http = require('http')
  , util = require('./util')
  , data
  , options
  , req
  ;

if (!path.existsSync(process.argv[2])) {
  console.log('Test file must be specified.');
  process.exit(1);
}

data = fs.readFileSync(process.argv[2]);
  
options = {
  host: 'localhost'
, port: 5000
, path: '/test'
, method: 'POST'
};

req = http.request(options, handleResponse);

req.on('error', function (e) {
  console.log('Error reaching server: ' + e.message);
  process.exit(1);
});

req.write(data);
req.end();

function handleResponse(res) {
  res.setEncoding('utf8');
  util.readData(res, function (data) {
    console.log('Server says: ' + data);
  });
}
