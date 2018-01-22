var express = require('express');
var router = express.Router();
var request = require('request');
var QuickBooks = require('node-quickbooks');
var Tokens = require('csrf');
var csrf = new Tokens();
const util = require('util');

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    UserInfo = require('../models/userInfo');

const userRepository = require('../Repository/userRepository');

router.post('/saveuserinfo', function (req, res) {
    console.log("API: saveuserinfo");

    let userInfo = new UserInfo();
    userInfo.email = req.body.email;
    userInfo.password = req.body.password;

    userRepository.saveUserInfo(req.body, (err, data) => {
        if (err) {
            console.log('*** saveuserinfo error: ' + util.inspect(err));
            return res.json({ status: { type: "error", msg: util.inspect(err) }, statusCode: 200 });
        } else {
            console.log('*** saveuserinfo ok');
            userInfo = data;
            return res.json({ status: { type: "success", msg: "saveuserinfo successfully!" }, statusCode: 200 });
        }
    });

});

router.post('/connecttojm', function (req, res) {
    console.log("API: connecttojm");

    let userInfo = new UserInfo();

    userRepository.getUserInfoByEmail(req.body.email, (err, data) => {

        if (err) {
            console.log('*** getUserInfoByEmail error: ' + util.inspect(err));
            return res.json({ status: { statusType: "JMA-ST-111", error: util.inspect(err) }, statusCode: 200 });
        } else {
            console.log('*** getUserInfoByEmail ok');
            userInfo = data;

            if (userInfo && userInfo.password === req.body.password) {
                return res.json({ status: { statusType: "JMA-ST-1002", error: null }, statusCode: 200 });
            }
            else {
                return res.json({ status: { statusType: "JMA-ST-113", error: null }, statusCode: 200 });
            }
        }


    });

});

module.exports = router;