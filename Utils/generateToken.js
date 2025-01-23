const jwt=require('jsonwebtoken');


exports.generateToken=(payload)=>{
const token=jwt.sign(payload,process.env.JWT,{expiresIn:"30d"});
return token;
}


