var express = require('express');
var router = express.Router();
const helper = require('./helper');


router.get('/', (req, res) => {
    helper.testFunction().then((result) => {
        res.send(result);
    });
});


module.exports = router;