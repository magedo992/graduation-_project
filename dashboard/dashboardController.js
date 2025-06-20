const animalCase=require('../Model/animalCaseModel');
const asyncHandler=require('express-async-handler');

exports.getAllData=asyncHandler(async (req,res)=>{
    const getAllCases=await animalCase.find({},{"__id":false});
})