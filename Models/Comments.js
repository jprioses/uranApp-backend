const {Schema, model} = require('mongoose');

const CommentsSchema = new Schema({
    content: {
        type: String,
        required : true
    },
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

module.exports = model('Comments', CommentsSchema, 'comments');