const {Schema, model} = require('mongoose');

const NotificationsSchema = new Schema({
    ref_parent: {
        type: Schema.ObjectId,
        ref: "Users",
        required : true
    },
    ref_users: {
        type: Schema.ObjectId,
        ref: "Users",
        required : true
    },
    recovery: {
        type: Object,
    },
    type: {
        type: String,
        required : true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Notifications', NotificationsSchema, 'notifications');
