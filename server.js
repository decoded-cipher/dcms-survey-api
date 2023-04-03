require('dotenv').config();

var database = require('./database');
database.connect();

var express = require('express');
var app = express();

var routes = require('./routes');
app.use('/', routes);


app.listen(3000, () => {
    console.log('\n\n--- Server started on PORT 3000!');
});