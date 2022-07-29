var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = require('./src/routes/index');

app.use(bodyParser.json());

app.use(router);

app.listen(3030);