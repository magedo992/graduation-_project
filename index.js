const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.port;
const db = require('./dbConfig/db');

const session = require('express-session');
const {verifay}=require('./Middelware/verifyToken');
const path=require('path')
const methodOverride = require('method-override');
const cors=require('cors');
const mountRouter = require('./Route/indexRouter');

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname,'view'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.JWT,   
    resave: false,
    saveUninitialized: true
}));
app.use(cors({origin:'*'}));
 


app.use(express.json());

mountRouter(app);



app.use((err, req, res, next) => {
    const errorMessage = err.message;
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        'status': 'error',
        'message': errorMessage
    });
});

app.listen(port, () => {
    db.connectToDb();
    console.log(`Server running on port ${port}`);
});
