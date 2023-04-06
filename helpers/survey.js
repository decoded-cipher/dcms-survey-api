const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');
const db = require('../config/database');
const jwt = require('jsonwebtoken');


module.exports = {

    createSurvey : (req, res) => {
        return new Promise((resolve, reject) => {

            var total_members = [];
            var house = { id : uuid() };

            for (var i = 0; i < req.body.members.length; i++) {
                
                var member = {
                    id : uuid(),
                    house_id : house.id,
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

                        
            house = {
                creator : req.authData.id,

                personal_details : req.body.personal_details,
                economic_details : req.body.economic_details,
                dcmsMember : req.body.dcmsMember,

                total_members : total_members.map((member) => member.id),

                created_at: new Date(),
                updated_at: new Date()
            };


            db.collection('members').insertMany(total_members, (err, result) => {
                var membersResult = result;

                if (err) {
                    reject({
                        status: 500,
                        message: "Error creating family member details",
                        error: err
                    });
                } else {

                    var house = {
                        id : uuid(),
                        creator : req.authData.id,

                        personal_details : req.body.personal_details,
                        economic_details : req.body.economic_details,
                        dcmsMember : req.body.dcmsMember,

                        total_members : total_members.map((member) => member.id),

                        created_at: new Date(),
                        updated_at: new Date()
                    };

                    db.collection('houses').insertOne(house, (err, result) => {
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
                                    members : membersResult,
                                    houses : result
                                }
                            });
                        }
                    });

                }
            });

            

        });
    }

}