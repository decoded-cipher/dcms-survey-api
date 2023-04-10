require('dotenv').config();
const cors = require('cors');

var database = require('./config/database.js');
database.connect();

var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var userRoutes = require('./routes/user');
var surveyRoutes = require('./routes/survey.js');   

app.use(cors());
app.use('/user', userRoutes);
app.use('/survey', surveyRoutes);


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


app.listen(3000, () => {
    console.log('\n\n--- Server started on PORT 3000!');
});