var express = require('express');
var router = express.Router();
var request = require('request');
var QuickBooks = require('node-quickbooks');
var Tokens = require('csrf');
var csrf = new Tokens();
const util = require('util');

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    CommonLogs = require('../models/commonLogs');

const helper = require('../Utils/helper');
const sessionManager = require('../Utils/sessionManager');


router.get('/getCompanyInfo', function (req, res, next) {

    if (!req.session) { return res.json({ status: { statusType: "JMA-ST-151", error: null }, statusCode: 200 }); }

    var qbSDK = helper.getQuickBooksSDK(sessionManager.getQBConfig(req.session));
    var commonLogs = new CommonLogs();
    commonLogs = sessionManager.getCommonLogs(req.session);

    if (qbSDK) {

        qbSDK.getCompanyInfo(qbSDK.realmId, function (err, companyInfo) {
            if (err) {
                commonLogs.validToken = false;
                sessionManager.saveCommonLogs(req.session, commonLogs);
                return res.json({ status: { statusType: "JMA-ST-151", error: util.inspect(err) }, statusCode: 200 });
            }
            else {

                commonLogs.validToken = true;
                sessionManager.saveCommonLogs(req.session, commonLogs);

                return res.json({
                    status:
                        {
                            statusType: "JMA-ST-1501",
                            error: util.inspect(err),
                            QBOData: companyInfo
                        },
                    statusCode: 200
                });
            }
        });

    }
    else {
        commonLogs.validToken = false;
        sessionManager.saveCommonLogs(req.session, commonLogs);
    }

});

module.exports = router;