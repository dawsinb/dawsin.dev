var express = require('express'),
path = require('path'),

// create app
app = express();

// set the port
app.set('port', 8080);

// tell express that we want to use the build folder
app.use(express.static(path.join(__dirname, '/build')));

// listen for requests
app.listen(app.get('port'), () => {
  console.log('Build server is listening on port: ' + app.get('port'));
});