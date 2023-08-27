const {Schema, model} = require('mongoose');

const UsersSchema = new Schema({
    name: {
        type: String,
        required : true
    },
    surname: {
        type: String,
        required : true
    },
    national_id: {
        type: Number,
        required : true
    },
    address: {
        type: String,
        required: true
    },
    neighborhood: Number,
    phone: Number,
    whatsapp: Number,
    email: String,
    role: {
        type: String,
        required : true
    },
    ref_polling_place: {
        type: Schema.ObjectId,
        ref: "polling_place",
        required : false
    },
    polling_table: Number,
    ref_godfather: {
        type: Schema.ObjectId,
        ref: "UserData",
        required : false
    },
    ref_leader: {
        type: Schema.ObjectId,
        ref: "UserData",
        required : false
    },
    photo: {
        type: String,
        default: 'default.png'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Users', UsersSchema, 'users');
