const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.port;
const db = require('./dbConfig/db');
const authRoute = require('./Route/authRoute');
const plantRoute = require('./Route/plantRoute');
const fertilizerRoute = require('./Route/fertilizerRoute');
const passport = require('passport');
const session = require('express-session');
const {verifay}=require('./Middelware/verifyToken');


app.use(session({
    secret: process.env.JWT,   
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());  


app.use(express.json());

app.use('/api', authRoute);
app.use('/Home',verifay, (req, res) => {
    res.status(200).json({
        "status": "success",
        "data": "hello world"
    });
});

app.use((err, req, res, next) => {
    const errorMessage = err.message;
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        'status': 'error',
        'errordata': errorMessage
    });
});
app.use('/api/plants', plantRoute);

app.use('/fertilizers', fertilizerRoute);

//app.use('/api/plants', plantRoute);

app.listen(port, () => {
    db.connectToDb();
    console.log(`Server running on port ${port}`);
});
