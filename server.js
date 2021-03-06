const express = require('express');
const app = express();
const path = require('path');
// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 8080;


app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', function (req, res) {

  // ejs render automatically looks in the views folder
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, function () {
  console.log('Our app is running on http://localhost:' + port);
});
