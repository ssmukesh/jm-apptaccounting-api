var express = require('express');
var router = express.Router();
var request = require('request');
var QuickBooks = require('node-quickbooks');
var Tokens = require('csrf');
var csrf = new Tokens();
const util = require('util');

router.get('/getCompanyInfo', function (req, res, next) {

    global.QBOObj.getCompanyInfo(global.QBOObj.realmId, function (err, companyInfo) {
        if (err) {
            return res.json({ status: { statusType: "JMA-ST-151", error: util.inspect(err) }, statusCode: 200 });
        }
        else {
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

});

module.exports = router;