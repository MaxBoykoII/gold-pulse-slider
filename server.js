"use strict";
let express = require('express'),
  path = require('path');


let app = express();
console.log(__dirname);
console.log(path.resolve(__dirname, '/client'));
app.use(express.static(path.resolve(__dirname, 'client')));


var port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Service started on port :' + port);
});