const asyncHandler=require('express-async-handler');
const animalCaseModel=require('../../Model/animalCaseModel');

exports.viewallReports=asyncHandler(async(req,res)=>{
    const animalCases=await animalCaseModel.find({});
    res.status(200).json({"message":"success",
        data:animalCases
    })
})

exports.getSingelReport=asyncHandler(async(req,res)=>{
    const id=req.params.id;
    const animalCase=await animalCaseModel.findById(id);
    if(!animalCase)
    {
        return res.status(404).json({
            "message":"error",
            data:"not found Report"
        });

    }
    return res.status(200).json({
        "message":"success",
        data:animalCase
    })
})

