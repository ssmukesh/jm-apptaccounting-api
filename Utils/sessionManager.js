const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    CommonLogs = require('../models/commonLogs');

class sessionManager {
    saveQBConfig(session, QBConfig) {
        session.QBConfig = QBConfig;
    }
    getQBConfig(session) {
        if (!session.QBConfig) return null
        return session.QBConfig;
    }
    saveUserInfo(session, UserInfo) {
        session.UserInfo = UserInfo;
    }
    getUserInfo(session) {
        if (!session.UserInfo) return null
        return session.UserInfo;
    }
    saveCommonLogs(session, CommonLog) {
        session.CommonLog = CommonLog;
    }
    getCommonLogs(session) {
        if (!session.CommonLog) return new CommonLogs();
        return session.CommonLog;
    }
}

module.exports = new sessionManager();