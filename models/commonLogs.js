const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const CommonLogSchema = new Schema({
    validToken: { type: Boolean, required: true, trim: true }    
});

module.exports = mongoose.model('CommonLogs', CommonLogSchema);