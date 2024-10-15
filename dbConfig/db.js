const mongoose = require('mongoose');

async function connectToDb() {
    try {
        await mongoose.connect(process.env.URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to DB");
    } catch (err) {
        console.error("Error connecting to DB:", err);
    }
}


exports.connectToDb=connectToDb;