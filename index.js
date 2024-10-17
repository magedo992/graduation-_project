const express =require('express');
require('dotenv').config();
const app=express();
const port  =process.env.port;
const db=require('./dbConfig/db');
const authRoute=require('./Route/authRoute');

app.use('/api',authRoute);
app.use('/Home',(req,res)=>{
    res.status(200).json({
        "status":"success",
        "data":"hello world"
    })
})


app.use((err ,req,res,next)=>{
    const errorMessage=err.message;
    const statusCode=err.statusCode||500;
    res.status(statusCode).json({
        'status':'error',
        'errordata':errorMessage
    })
})
app.listen(port,()=>{
    db.connectToDb();
    console.log(`hosted in port ${port}`);
    
})