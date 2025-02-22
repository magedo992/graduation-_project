const authRoute=require('./authRoute');
const PlantRouter=require('./plantRoute');
const Veterinary=require('./animalCaseRoute');
const animal=require('./animalRoute')

const mountRouter=(app)=>{
    app.use('/api',authRoute);
    app.use('/plant',PlantRouter);
    app.use('/Veterinary',Veterinary);
    app.use('/animal',animal)

}

module.exports=mountRouter;