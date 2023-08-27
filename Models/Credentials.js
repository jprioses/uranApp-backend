const {Schema, model} = require('mongoose');

const CredentialsSchema = new Schema({
    username: {
        type: String,
        required : true
    },
    password: {
        type: String,
        required : true
    },
    ref_users: {
        type: Schema.ObjectId,
        ref: "Users",
        required : false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Credentials', CredentialsSchema, 'credentials');
