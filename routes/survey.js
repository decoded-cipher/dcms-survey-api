var express = require('express');
var router = express.Router();
const helper = require('../helpers/user.js');


router.get('/', (req, res) => {
    helper.testFunction().then((result) => {
        res.send("Survey - " + result);
    });
});


module.exports = router;