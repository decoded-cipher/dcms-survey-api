const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');
const db = require('../config/database');
const jwt = require('jsonwebtoken');


module.exports = {

    userSignup : (req, res) => {
        return new Promise((resolve, reject) => {

            var user = {
                id : uuid(),
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(5), null),
                type: "user",
                status: "active",
                created_at: new Date(),
                updated_at: new Date()
            };

            db.collection('users').findOne({email: user.email}, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    if (result) {
                        reject({
                            status: 409,
                            message: "Email already exists"
                        });
                    } else {
                        db.collection('users').insertOne(user, (err, result) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve({
                                    status: 200,
                                    message: "User created successfully",
                                    result: result
                                });
                            }
                        });
                    }
                }
            });

        });
    },




    userLogin : (req, res) => {
        return new Promise((resolve, reject) => {

            var user = {
                email: req.body.email,
                password: req.body.password
            };

            db.collection('users').findOne({email: user.email}, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    if (result) {
                        if (bcrypt.compareSync(user.password, result.password)) {
                            resolve({
                                status: 200,
                                message: "User logged in successfully",
                                token: jwt.sign({id: result.id, email: result.email}, process.env.JWT_SECRET)
                            });
                        } else {
                            reject({
                                status: 401,
                                message: "Incorrect password"
                            });
                        }
                    } else {
                        reject({
                            status: 404,
                            message: "User not found"
                        });
                    }
                }
            });

        });
    }

}