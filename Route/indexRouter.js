const authRoute=require('./authRoute');
const fertilizerRouter=require('./fertilizerRoute');

const mountRouter=(app)=>{
    app.use('/api',authRoute);
    app.use('/fertilizer',fertilizerRouter);


}

module.exports=mountRouter;