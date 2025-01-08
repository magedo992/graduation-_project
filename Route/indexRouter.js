const authRoute=require('./authRoute');
const fertilizerRouter=require('./fertilizerRoute');
const chemicalsRouter=require('./chemicalsRoute');
const PlantRouter=require('./plantRoute');

const mountRouter=(app)=>{
    app.use('/api',authRoute);
    app.use('/fertilizer',fertilizerRouter);
    app.use('/chemical',chemicalsRouter);
    app.use('/plant',PlantRouter);


}

module.exports=mountRouter;