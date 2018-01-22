const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    QBConfig = require('../models/qbconfig');

const util = require('util');
const sessionManager = require('../Utils/sessionManager');
const helper = require('../Utils/helper');

class qbRepository {

    saveQBConfig(body, callback) {

        console.log('*** QBConfigRepository.saveQBConfig');

        let qbConfig = new QBConfig();
        qbConfig.consumerKey = body.consumerKey;
        qbConfig.consumerSecret = body.consumerSecret;
        qbConfig.access_token = body.access_token;
        qbConfig.realmId = body.realmId;
        qbConfig.refresh_token = body.refresh_token;
        qbConfig.createdAt = new Date();

        this.deleteQBConfig(qbConfig, (err, data) => {
            if (err) {
                return callback(err, null);
            }
            else {
                qbConfig.save((err, qbConfig) => {
                    if (err) {
                        console.log(`*** QBConfigRepository insertQBConfig error: ${err}`);
                        return callback(err, null);
                    }
                    callback(null, qbConfig);
                });
            }
        });

    }

    getQBConfig(session, callback) {
        console.log('*** QBConfigRepository.getQBConfig');

        QBConfig.count((err, qbConfigCount) => {
            let count = qbConfigCount;
            console.log(`QBConfig count: ${count}`);

            QBConfig.find({}, (err, qbConfig) => {
                if (err) {
                    console.log(`*** QBConfigRepository.getQBConfig error: ${err}`);
                    return callback(err);
                }

                if (session && count > 0) sessionManager.saveQBConfig(session, qbConfig[0]);

                callback(null, {
                    count: count,
                    qbConfig: qbConfig
                });
            });
        });

    }

    deleteQBConfig(body, callback) {
        console.log('*** QBConfigRepository.deleteQBConfig');

        QBConfig.remove({ 'realmId': body.realmId }, (err, qbConfig) => {
            if (err) {
                console.log(`*** QBConfigRepository.deleteQBConfig error: ${err}`);
                return callback(err, null);
            }
            callback(null, qbConfig);
        });
    }

}

module.exports = new qbRepository();