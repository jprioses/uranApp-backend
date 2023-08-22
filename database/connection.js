const mongoose = require('mongoose');

const connection = async() => {
    try {
        await mongoose.connect('mongodb://localhost:27017/uran-app');
        console.log('Connected to database uran-app');
    } catch (error) {
        console.log(error);
        throw new Error('Can not access to database');
    }
};

module.exports = connection;