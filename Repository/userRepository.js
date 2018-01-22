const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    UserInfo = require('../models/userInfo');

const util = require('util');

class userRepository {

    saveUserInfo(body, callback) {
        console.log('*** QBConfigRepository.saveUserInfo');

        let userInfo = new UserInfo();
        userInfo.email = body.email;
        userInfo.password = body.password;

        userInfo.save((err, userInfo) => {
            if (err) {
                console.log(`*** QBConfigRepository saveUserInfo error: ${err}`);
                return callback(err, null);
            }
            callback(null, userInfo);
        });

    }

    getUserInfoByEmail(email, callback) {
        console.log('*** QBConfigRepository.getUserInfoByEmail');

        UserInfo.findOne({ 'email': email }, (err, userInfo) => {
            if (err) {
                console.log(`*** QBConfigRepository.getUserInfoByEmail error: ${err}`);
                return callback(err);
            }
            callback(null, userInfo);
        });

    }

}

module.exports = new userRepository();