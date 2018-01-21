var express = require('express');
var router = express.Router();
var request = require('request');
var QuickBooks = require('node-quickbooks');
var Tokens = require('csrf');
var csrf = new Tokens();
const util = require('util');

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
        '&state=' + generateAntiForgery(req.session);

    res.redirect(redirecturl);

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

        // save the access token somewhere on behalf of the logged in user
        var qbo = new QuickBooks(consumerKey,
            consumerSecret,
            accessToken.access_token, /* oAuth access token */
            false, /* no token secret for oAuth 2.0 */
            req.query.realmId,
            false, /* use a sandbox account */
            true, /* turn debugging on */
            14, /* minor version */
            '2.0', /* oauth version */
            accessToken.refresh_token /* refresh token */);

        global.QBOObj = qbo;

        res.send('<!DOCTYPE html><html lang="en"><head></head><body><script>window.opener.location.assign("/home");window.close();</script></body></html>');

    });
    //res.send('<!DOCTYPE html><html lang="en"><head></head><body><script>window.opener.location.assign("/home");window.close();</script></body></html>');
});

// OAUTH 2 makes use of redirect requests
function generateAntiForgery(session) {
    session.secret = csrf.secretSync();
    return csrf.create(session.secret);
};

module.exports = router;
