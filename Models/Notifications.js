const {Schema, model} = require('mongoose');

const NotificationsSchema = new Schema({
    type: {
        type: String,
        required : true
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: String,
    ref_user_data: {
        type: Schema.ObjectId,
        ref: "UserData",
        required : true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Notifications', NotificationsSchema, 'notifications');
