const mongoose = require('mongoose');

//'mongodb://localhost:27017/uran-app'
//mongodb+srv://jpriosescobar:1037634540@cluster0.fmjhghl.mongodb.net/

const connection = async() => {
    try {
        await mongoose.connect('mongodb+srv://jpriosescobar:1037634540@cluster0.fmjhghl.mongodb.net/uran-app');
        console.log('Connected to database uran-app');
    } catch (error) {
        console.log('here')
        throw new Error(error);
    }
};

module.exports = connection;