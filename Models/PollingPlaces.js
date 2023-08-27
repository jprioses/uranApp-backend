const {Schema, model} = require('mongoose');

const PollingPlacesSchema = new Schema({
    name: {
        type: String,
        required : true
    },
    address: String,
    north_coord: {
        type: Number,
        required : true
    },
    east_coord: {
        type: Number,
        required : true
    },
});

module.exports = model('PollingPlaces', PollingPlacesSchema, 'polling_places');
