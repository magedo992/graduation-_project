const express =require('express');
require('dotenv').config();
const app=express();
const port  =process.env.port;
const db=require('./dbConfig/db');




app.listen(port,()=>{
    db.connectToDb();
    console.log(`hosted in port ${port}`);
    
})