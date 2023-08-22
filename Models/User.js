const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    username: {
        type: String,
        required : true
    },
    password: {
        type: String,
        required : true
    },
    ref_user_data: {
        type: Schema.ObjectId,
        ref: "UserData",
        required : false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('User', UserSchema, 'user');
