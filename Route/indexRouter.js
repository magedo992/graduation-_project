const authRoute=require('./authRoute');
const PlantRouter=require('./plantRoute');

const mountRouter=(app)=>{
    app.use('/api',authRoute);
    app.use('/plant',PlantRouter);


}

module.exports=mountRouter;