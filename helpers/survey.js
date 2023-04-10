const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');
const db = require('../config/database');
const jwt = require('jsonwebtoken');


module.exports = {

    createSurvey : async (req, res) => {
        return new Promise((resolve, reject) => {

            var total_members = [];
            var house_id = uuid();

            for (var i = 0; i < req.body.members.length; i++) {
                
                var member = {
                    id : uuid(),
                    house_id : house_id
                };

                for (var key in req.body.members[i]) {
                    if (req.body.members[i].hasOwnProperty(key)) {
                        member[key] = req.body.members[i][key];
                    } else {
                        member[key] = null;
                    }
                }

                member.created_at = new Date();
                member.updated_at = new Date();

                total_members.push(member);
            }


            db.collection('members').insertMany(total_members, async (err, result) => {
                var membersResult = result;

                if (err) {
                    reject({
                        status: 500,
                        message: "Error creating family member details",
                        error: err
                    });
                } else {

                    var house = {
                        id : house_id,
                        creator : req.authData.id,

                        personal_details : req.body.personal_details,
                        economic_details : req.body.economic_details,
                        dcmsMember : req.body.dcmsMember,

                        total_members : total_members.map((member) => member.id),

                        created_at: new Date(),
                        updated_at: new Date()
                    };

                    db.collection('houses').insertOne(house, async (err, result) => {
                        if (err) {
                            reject({
                                status: 500,
                                message: "Error creating house details",
                                error: err
                            });
                        } else {
                            resolve({
                                status: 200,
                                message: "Data saved successfully",
                                result: {
                                    members: membersResult,
                                    houses: result
                                }
                            });
                        }
                    });

                }
            });

            

        });
    },




    getHouseById : (req, res) => {
        return new Promise((resolve, reject) => {
            db.collection('houses').findOne({ id : req.params.id }, async (err, result) => {
                
                var houseResult = result;
                
                if (err) {
                    reject({
                        status: 500,
                        message: "Error getting house details",
                        error: err
                    });
                } else {
                    
                    if(result) {
                        var total_members = houseResult.total_members;
                        db.collection('members').find({ id: { $in: total_members } }).toArray(async (err, result) => {
                            if (err) {
                                reject({
                                    status: 500,
                                    message: "Error getting members details",
                                    error: err
                                });
                            } else {
                                resolve({
                                    status: 200,
                                    message: "House details fetched successfully",
                                    result: {
                                        house: houseResult,
                                        members: result
                                    }
                                });
                            }
                        });
                    } else {
                        reject({
                            status: 404,
                            message: "House not found",
                            error: err
                        });
                    }
                    
                }
            });
        });
    },




    getMemberById : (req, res) => {
        return new Promise((resolve, reject) => {
            db.collection('members').findOne({ id : req.params.id }, (err, result) => {
                var memberResult = result;

                if (err) {
                    reject({
                        status: 500,
                        message: "Error getting member details",
                        error: err
                    });
                } else {
                                        
                    if(result) {
                        req.params.id = memberResult.house_id;
                        module.exports.getHouseById(req, res).then((result) => {
                            resolve({
                                status: 200,
                                message: "Member details fetched successfully",
                                result: {
                                    member : memberResult,
                                    house : result.result.house,
                                    family : result.result.members
                                }
                            });
                        }).catch((err) => {
                            reject({
                                status: err.status,
                                message: err.message,
                                error: err.error
                            });
                        });
                    } else {
                        reject({
                            status: 404,
                            message: "Member not found",
                            error: err
                        });
                    }

                }
            });
        });
    },

}