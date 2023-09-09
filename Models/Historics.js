const {Schema, model} = require('mongoose');

const HistoricsSchema = new Schema({
    recovery: [
        {
            data: Object,
            date: {
                type: Date,
                default: Date.now
            },
            deleted: Boolean
        }

    ],
    ref_users: {
        type: Schema.ObjectId,
        ref: "Users",
        required : false
    },
    
});

module.exports = model('Historics', HistoricsSchema, 'historic');