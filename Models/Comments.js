const {Schema, model} = require('mongoose');

const CommentsSchema = new Schema({
    content: {
        type: String,
        required : true
    },
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

module.exports = model('Comments', CommentsSchema, 'comments');