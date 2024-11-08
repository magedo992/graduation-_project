const mongoose = require('mongoose');
const chemicalsSchema = new mongoose.Schema({

name: {
 type:String,
 required: true,
},


ChemicalsType:{
type: String,
required: true,

},
activeingredient :{
name:String,
concentration: Number,
},


safetyPeriod :{
type:Number,

},


pricePerKG:{
type:Number,

},


images:[
{

    url:String,
}
     ],

});

module.exports=mongoose.model('chemical',chemicalsSchema);