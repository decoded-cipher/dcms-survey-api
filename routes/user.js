const express = require('express');
const router = express.Router();
const helper = require('../helpers/user.js');


router.post('/signup', (req, res) => {
    helper.userSignup(req, res).then((result) => {
        res.status(result.status).json(
            {
                message : result.message,
                result : result.result
            }
        );
    }).catch((err) => {
        res.status(err.status).json({ message : err.message });
    });
});


router.post('/login', (req, res) => {
    helper.userLogin(req, res).then((result) => {
        res.status(result.status).json(
            {
                message : result.message,
                token : result.token
            }
        );
    }).catch((err) => {
        res.status(err.status).json({ message : err.message });
    });
});





module.exports = router;