const { connectDB } = require('./connect-db')

/* This code initializes the database with sample users.
 Note, it does not drop the database - this can be done manually. Having code in your application that could drop your whole DB is a fairly risky choice.*/
module.exports = (async function initializeDB(){
    let db = await connectDB();
})();


