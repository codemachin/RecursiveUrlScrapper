const mongoose = require('mongoose');
// inilialise the models
require('../models/Urls');

const dbPath  = process.env.MONGOHOST || "mongodb://localhost/rentomojo";
let db = null;

// function to connect to database
const connectDB = async function(){
    if (db) return db;
    db = mongoose.connect(dbPath, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false});
        // Handle db connection error
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    // connect to database and execute the function
    mongoose.connection.once('open', function() {
        console.log("database connection open success");
    });
    return db;
}

module.exports = { connectDB }