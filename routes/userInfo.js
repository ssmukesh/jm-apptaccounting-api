var express = require('express');
var router = express.Router();
var request = require('request');
var QuickBooks = require('node-quickbooks');
var Tokens = require('csrf');
var csrf = new Tokens();
const util = require('util');
const helper = require('../Utils/helper');

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    UserInfo = require('../models/userInfo');

const userRepository = require('../Repository/userRepository');
const qbRepository = require('../Repository/qbRepository');

router.post('/saveuserinfo', function (req, res) {
    console.log("API: saveuserinfo");

    let userInfo = new UserInfo();
    userInfo.email = req.body.email;
    userInfo.password = req.body.password;

    userRepository.saveUserInfo(req.body, (err, data) => {
        if (err) {
            var configCode = helper.getConfig_Codes("error", "API", "2050");
            console.log('*** saveuserinfo error: ' + util.inspect(err));
            return res.json({ status: configCode, statusCode: 200 });
        } else {
            var configCode = helper.getConfig_Codes("success", "API", "1050");
            console.log('*** saveuserinfo ok');
            userInfo = data;
            return res.json({ status: configCode, statusCode: 200 });
        }
    });

});

router.post('/connecttojm', function (req, res) {
    console.log("API: connecttojm");

    let userInfo = new UserInfo();

    userRepository.getUserInfoByEmail(req.body.email, (err, data) => {

        if (err) {
            var configCode = helper.getConfig_Codes("error", "API", "2060");
            console.log('*** getUserInfoByEmail error: ' + util.inspect(err));
            return res.json({ status: configCode, statusCode: 200 });
        } else {
            console.log('*** getUserInfoByEmail ok');
            userInfo = data;

            if (userInfo && userInfo.password === req.body.password) {

                qbRepository.getQBConfig(req.session, (err, data) => {
                    if (err) {
                        var configCode = helper.getConfig_Codes("error", "API", "2060");
                        return res.json({ status: configCode, statusCode: 200 });
                    }
                    else {
                        var configCode = helper.getConfig_Codes("success", "API", "1060");
                        return res.json({ status: configCode, statusCode: 200 });
                    }
                });

            }
            else {
                var configCode = helper.getConfig_Codes("error", "API", "2120");
                return res.json({ status: configCode, statusCode: 200 });
            }
        }

    });

});

router.get('/refreshQBConfig', function (req, res, next) {
    qbRepository.getQBConfig(req.session, (err, data) => {
        if (err) {
            var configCode = helper.getConfig_Codes("error", "API", "2060");
            return res.json({ status: configCode, statusCode: 200 });
        }
        else {
            var configCode = helper.getConfig_Codes("success", "API", "1060");
            return res.json({ status: configCode, statusCode: 200 });
        }
    });
});

module.exports = router;