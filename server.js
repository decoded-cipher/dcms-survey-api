require('dotenv').config();

var database = require('./config/database.js');
database.connect();

var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var userRoutes = require('./routes/user');
var surveyRoutes = require('./routes/survey.js');   

app.use('/user', userRoutes);
app.use('/survey', surveyRoutes);



app.listen(3000, () => {
    console.log('\n\n--- Server started on PORT 3000!');
});