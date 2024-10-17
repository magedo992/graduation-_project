const jwt=require('jsonwebtoken');


exports.generateToken=(payload)=>{
const token=jwt.sign(payload,process.env.JWT,{expiresIn:'1h'});
return token;
}


