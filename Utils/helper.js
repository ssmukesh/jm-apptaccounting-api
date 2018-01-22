var Tokens = require('csrf');
var csrf = new Tokens();

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

}

module.exports = new helper();