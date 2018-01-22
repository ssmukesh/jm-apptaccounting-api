var express = require('express');
var router = express.Router();
var request = require('request');
var QuickBooks = require('node-quickbooks');
const util = require('util');

const helper = require('../Utils/helper');
const qbRepository = require('../Repository/qbRepository');
const sessionManager = require('../Utils/sessionManager');

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    QBConfig = require('../models/qbconfig');

// INSERT YOUR CONSUMER_KEY AND CONSUMER_SECRET HERE

// SandBox
// var consumerKey = 'Q0q63VIwq7SAQ8v6aop4mol1V6n0jk2lUB5WKu4LPN60wJLgBF';
// var consumerSecret = 'gJaFcxJ8ouAx5RlQSkIjsjhwIUqfYXcP1IHaJeqC';

// PRODUCTION  
var consumerKey = 'Q0VDE5PpLWcqaT2sZHjjFYHakq2vB6OBqa67Uhm7JrlyOSzski';
var consumerSecret = 'FbEwwsfQi6V5DRUbjVAApAYjjMPuuz1161ipI1jg';

/* GET home page. */
router.get('/requestToken', function (req, res, next) {

    var redirecturl = QuickBooks.AUTHORIZATION_URL +
        '?client_id=' + consumerKey +
        '&redirect_uri=' + encodeURIComponent('https://janhavimeadows-api.herokuapp.com/api/callback') +  //Make sure this path matches entry in application dashboard
        '&scope=com.intuit.quickbooks.accounting' +
        '&response_type=code' +
        '&state=' + helper.generateAntiForgery(req.session);

    res.redirect(redirecturl);

});

router.get('/refreshtoken', function (req, res, next) {

    qbRepository.getQBConfig(req.session, (err, data) => {

        if (err) {
            return res.json({ status: { statusType: "JMA-ST-162", error: err }, statusCode: 200 });
        }
        else {
            var qbConfig = sessionManager.getQBConfig(req.session);

            var auth = (new Buffer(qbConfig.consumerKey + ':' + qbConfig.consumerSecret).toString('base64'));

            var postBody = {
                url: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: 'Basic ' + auth,
                },
                form: {
                    grant_type: 'refresh_token',
                    refresh_token: qbConfig.refresh_token
                }
            };

            request.post(postBody, function (err, response, data) {
                if (err || response.statusCode != 200) {
                    return res.json({ status: { statusType: "JMA-ST-162", error: err }, statusCode: 200 });
                }

                var accessToken = JSON.parse(response.body);

                qbConfig.access_token = accessToken.access_token;
                qbConfig.refresh_token = accessToken.refresh_token;

                qbRepository.saveQBConfig(qbConfig, (err, data) => {
                    if (err) {
                        console.log('*** saveQBConfig error: ' + util.inspect(err));
                        return res.json({ status: { statusType: "JMA-ST-162", error: err }, statusCode: 200 });
                    } else {
                        console.log('*** QBConfig saved successfully!');
                        return res.json({ status: { statusType: "JMA-ST-1002", error: null }, statusCode: 200 });
                    }
                });
            });

        }

    });

});

router.get('/callback', function (req, res, next) {
    var auth = (new Buffer(consumerKey + ':' + consumerSecret).toString('base64'));
    console.log(auth);

    var postBody = {
        url: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + auth,
        },
        form: {
            grant_type: 'authorization_code',
            code: req.query.code,
            redirect_uri: 'https://janhavimeadows-api.herokuapp.com/api/callback'  //Make sure this path matches entry in application dashboard
        }
    };

    request.post(postBody, function (err, response, data) {

        if (err || response.statusCode != 200) {
            console.log("--Callback-- Error: " + err);
            res.render('pages/qbconnect-error');
        }

        var accessToken = JSON.parse(response.body);

        let qbConfig = new QBConfig();
        qbConfig.consumerKey = consumerKey;
        qbConfig.consumerSecret = consumerSecret;
        qbConfig.access_token = accessToken.access_token;
        qbConfig.realmId = req.query.realmId;
        qbConfig.refresh_token = accessToken.refresh_token;

        qbRepository.saveQBConfig(qbConfig, (err, data) => {
            if (err) {
                console.log('*** saveQBConfig error: ' + util.inspect(err));
                res.send('<!DOCTYPE html><html lang="en"><head></head><body><script>window.opener.location.assign("/error");window.close();</script></body></html>');
            } else {
                console.log('*** QBConfig saved successfully!');
                res.send('<!DOCTYPE html><html lang="en"><head></head><body><script>window.opener.location.assign("/home");window.close();</script></body></html>');
            }
        });
    });

});




module.exports = router;
