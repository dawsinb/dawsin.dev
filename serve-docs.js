var express = require('express'),
path = require('path'),

// create app
app = express();

// set the port
app.set('port', 8080);

// tell express that we want to use the docs folder
app.use(express.static(path.join(__dirname, '/docs')));

// listen for requests
app.listen(app.get('port'), () => {
  console.log('Docs server is listening on port: ' + app.get('port'));
});