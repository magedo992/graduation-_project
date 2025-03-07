const authRoute=require('./authRoute');
const PlantRouter=require('./plantRoute');
const Veterinary=require('./animalCaseRoute');
const animal=require('./animalRoute');
const uploadimage=require('./uploadImage');

const mountRouter=(app)=>{
    app.use('/api',authRoute);
    app.use('/plant',PlantRouter);
    app.use('/Veterinary',Veterinary);
    app.use('/animal',animal)
    app.use('/image',uploadimage)

}

module.exports=mountRouter;