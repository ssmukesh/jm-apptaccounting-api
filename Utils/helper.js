var Tokens = require('csrf');
var csrf = new Tokens();
var QuickBooks = require('node-quickbooks');
// Load the full build.
var _jsQuery = require('lodash');
const config_Codes = require("../config/config.codes.json");

class helper {

    generateAntiForgery(session) {
        session.secret = csrf.secretSync();
        return csrf.create(session.secret);
    }

    getQuickBooksSDK(qbConfig) {

        console.log('*** getQuickBooksSDK');

        if (qbConfig) {
            var qbo = new QuickBooks(qbConfig.consumerKey,
                qbConfig.consumerSecret,
                qbConfig.access_token, /* oAuth access token */
                false, /* no token secret for oAuth 2.0 */
                qbConfig.realmId,
                true, /* use a sandbox account */
                true, /* turn debugging on */
                14, /* minor version */
                '2.0', /* oauth version */
                qbConfig.refresh_token /* refresh token */);

            return qbo;
        }
        else {
            return null;
        }

    }

    getConfig_Codes(status, type, code) {
        if (_jsQuery.isEqual(status, "success")) {
            if (_jsQuery.isEqual(type, "database")) {
                return _jsQuery.find(config_Codes.AppMessageCodes.success.database, { 'code': code });
            }
            else if (_jsQuery.isEqual(type, "API")) {
                return _jsQuery.find(config_Codes.AppMessageCodes.success.API, { 'code': code });
            }
            else if (_jsQuery.isEqual(type, "QuickBooks")) {
                return _jsQuery.find(config_Codes.AppMessageCodes.success.QuickBooks, { 'code': code });
            }
        }
        if (_jsQuery.isEqual(status, "error")) {
            if (_jsQuery.isEqual(type, "database")) {
                return _jsQuery.find(config_Codes.AppMessageCodes.error.database, { 'code': code });
            }
            else if (_jsQuery.isEqual(type, "API")) {
                return _jsQuery.find(config_Codes.AppMessageCodes.error.API, { 'code': code });
            }
            else if (_jsQuery.isEqual(type, "QuickBooks")) {
                return _jsQuery.find(config_Codes.AppMessageCodes.error.QuickBooks, { 'code': code });
            }
        }
        return null;
    }

}

module.exports = new helper();