const authRoute=require('./authRoute');
const PlantRouter=require('./plantRoute');
const Veterinary=require('./animalCaseRoute');
const animal=require('./animalRoute');
const uploadimage=require('./uploadImage');
const dashboard=require('../dashboard/dashboardRoute');

const mountRouter=(app)=>{
    app.use('/api',authRoute);
    app.use('/plant',PlantRouter);
    app.use('/Veterinary',Veterinary);
    app.use('/animal',animal)
    app.use('/image',uploadimage)
    app.use('/dashboard',dashboard)

}

module.exports=mountRouter;