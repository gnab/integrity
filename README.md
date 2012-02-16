# integrity

A node.js module for evaluating JavaScript in the browser.

### Usage

From the command line:

1. `integrity-server`
2. Open http://localhost:5000
3. `integrity -e '1 + 2'` or `integrity code.js`

From your code:

    // Server
    var integrity = require('integrity');
    integrity.serve();

    // Client
    var integrity = require('integrity');
    integrity.run('1 + 2', function (error, result) {
      if (error) {
        console.error('Error: %s', error);
        return;
      }

      console.log('Result: %s', result);
    });
