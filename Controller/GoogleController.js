
const asyncHandler=require('express-async-handler');
const userModel=require('../Model/UserModel');
const {generateToken}=require('../Utils/generateToken');

exports.googleAuth= asyncHandler(async (req, res) => {
    const {uid, email, displayName, photoURL } = req.body;
   
    
  

      let user= await userModel.findOne({email});
      
      
      if(!user)
      {
          user =await userModel.create({
            email:email,
            username:displayName,
            googleId:uid,
            image:photoURL,
            isActive:true,
            phone:null,
            birthDay:null,
            city:null
          })
      }
      console.log(user);
     const token= generateToken({id:user._id});
    
     res.status(200).json({token:token});
})

// exports.facebookAuth= asyncHandler(async (req,res)=>{
//   const { accessToken } = req.body;
//   if(!accessToken)
//   {
//     return res.status(400).json({message:"Facebook access token is required"});
//   }
//   const credential = admin.auth.FacebookAuthProvider.credential(accessToken);
//   const userRecord = await admin.auth().signInWithCredential(credential);

//   let user=await userModel.find({email:userRecord.email});
//   if(!user)
//   {
//     let user=await userModel.create({email:userRecord.email});
//   }

// })