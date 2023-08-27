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
    ref_users: {
        type: Schema.ObjectId,
        ref: "Users",
        required : true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Notifications', NotificationsSchema, 'notifications');
