const express=require('express');
const router=express.Router();
const {getDashboardStats}=require('./controller/dashboardController');


    router.get('/getdashboardStats',getDashboardStats);
  

    module.exports=router