const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    UserInfo = require('../models/userInfo');

const helper = require('../Utils/helper');
const util = require('util');

class userRepository {

    saveUserInfo(body, callback) {
        console.log('*** QBConfigRepository.saveUserInfo');

        let userInfo = new UserInfo();
        userInfo.email = body.email;
        userInfo.password = body.password;

        userInfo.save((err, userInfo) => {
            if (err) {
                var configCode = helper.getConfig_Codes("error", "database", "2010");
                console.log(configCode + `*** QBConfigRepository saveUserInfo error: ${err}`);
                return callback(err, null);
            }
            callback(null, userInfo);
        });

    }

    getUserInfoByEmail(email, callback) {
        console.log('*** QBConfigRepository.getUserInfoByEmail');

        UserInfo.findOne({ 'email': email }, (err, userInfo) => {
            if (err) {
                var configCode = helper.getConfig_Codes("error", "database", "2000");
                console.log(configCode + `*** QBConfigRepository.getUserInfoByEmail error: ${err}`);
                return callback(err);
            }
            else {
                callback(null, userInfo);
            }

        });

    }

}

module.exports = new userRepository();