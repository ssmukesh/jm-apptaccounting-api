var express = require('express');
var router = express.Router();
var request = require('request');
var QuickBooks = require('node-quickbooks');
var Tokens = require('csrf');
var csrf = new Tokens();
const util = require('util');
const helper = require('../Utils/helper');
const sessionManager = require('../Utils/sessionManager');
const qbRepository = require('../Repository/qbRepository');

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    CommonLogs = require('../models/commonLogs');



router.get('/getCompanyInfo', function (req, res, next) {

    if (!req.session) { return res.json({ status: { statusType: "JMA-ST-151", error: null }, statusCode: 200 }); }

    var commonLogs = new CommonLogs();
    commonLogs = sessionManager.getCommonLogs(req.session);

    var qbSDK = helper.getQuickBooksSDK(sessionManager.getQBConfig(req.session));

    if (qbSDK) {

        qbSDK.getCompanyInfo(qbSDK.realmId, function (err, companyInfo) {
            if (err) {
                commonLogs.validToken = false;
                sessionManager.saveCommonLogs(req.session, commonLogs);
                var configCode = helper.getConfig_Codes("error", "QuickBooks", "0001");
                return res.json({ status: configCode, statusCode: 200 });
            }
            else {
                commonLogs.validToken = true;
                sessionManager.saveCommonLogs(req.session, commonLogs);
                var configCode = helper.getConfig_Codes("success", "QuickBooks", "1120");
                return res.json({ status: configCode, QBOData: companyInfo, statusCode: 200 });
            }
        });

    }
    else {
        commonLogs.validToken = false;
        sessionManager.saveCommonLogs(req.session, commonLogs);
        var configCode = helper.getConfig_Codes("error", "API", "0000");
        return res.json({ status: configCode, statusCode: 200 });
    }

});

router.get('/findCustomers', function (req, res, next) {

    if (!req.session) { return res.json({ status: { statusType: "JMA-ST-151", error: null }, statusCode: 200 }); }

    var commonLogs = new CommonLogs();
    commonLogs = sessionManager.getCommonLogs(req.session);

    var qbSDK = helper.getQuickBooksSDK(sessionManager.getQBConfig(req.session));

    if (qbSDK) {

        qbSDK.findCustomers(function (err, customers) {
            if (err) {
                commonLogs.validToken = false;
                sessionManager.saveCommonLogs(req.session, commonLogs);
                var configCode = helper.getConfig_Codes("error", "QuickBooks", "0001");
                return res.json({ status: configCode, statusCode: 200 });
            }
            else {
                commonLogs.validToken = true;
                sessionManager.saveCommonLogs(req.session, commonLogs);
                var configCode = helper.getConfig_Codes("success", "QuickBooks", "1130");
                return res.json({ status: configCode, QBOData: customers.QueryResponse.Customer, statusCode: 200 });
            }
        });

    }
    else {
        commonLogs.validToken = false;
        sessionManager.saveCommonLogs(req.session, commonLogs);
        var configCode = helper.getConfig_Codes("error", "API", "0000");
        return res.json({ status: configCode, statusCode: 200 });
    }

});



module.exports = router;