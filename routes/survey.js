const express = require('express');
const router = express.Router();
const helper = require('../helpers/survey.js');
const jwt = require('jsonwebtoken');


router.use((req, res, next) => {
    var bearerToken = req.headers['authorization'];

    if (typeof bearerToken !== 'undefined') {
        var token = bearerToken.split(" ").pop();

        jwt.verify(token, process.env.JWT_SECRET, (err, authData) => {
            if (err) {
                res.status(403).json({ message : "Forbidden" });
            } else {
                req.authData = authData;
                next();
            }
        });

    } else {
        res.status(403).json( {message : "No token provided"} );
    }
});




router.post('/create', (req, res) => {
    helper.createSurvey(req, res).then((result) => {
        res.status(result.status).json(
            {
                message : result.message,
                result : result.result
            }
        );
    }).catch((err) => {
        res.status(err.status).json(
            {
                message : err.message,
                error : err.error
            }
        );
    });
});


router.get('/house/:id', (req, res) => {
    helper.getHouseById(req, res).then((result) => {
        res.status(result.status).json(
            {
                message : result.message,
                result : result.result
            }
        );
    }).catch((err) => {
        res.status(err.status).json(
            {
                message : err.message,
                error : err.error
            }
        );
    });
});


router.get('/member/:id', (req, res) => {
    helper.getMemberById(req, res).then((result) => {
        res.status(result.status).json(
            {
                message : result.message,
                result : result.result
            }
        );
    }).catch((err) => {
        res.status(err.status).json(
            {
                message : err.message,
                error : err.error
            }
        );
    });
});








module.exports = router;