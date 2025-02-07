const authRoute=require('./authRoute');
const PlantRouter=require('./plantRoute');
const Veterinary=require('./animalCaseRoute');

const mountRouter=(app)=>{
    app.use('/api',authRoute);
    app.use('/plant',PlantRouter);
    app.use('/Veterinary',Veterinary);

}

module.exports=mountRouter;