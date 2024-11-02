const authVaildator=require('../../Utils/Validator/authValidation');

exports.singUp=(req,res,next)=>{
    console.log("in signUp validation");
    authVaildator.check(req.body,authVaildator.signUpValidation,next);
    
}

exports.login=(req,res,next)=>{
    console.log("in validation");
    authVaildator.check(req.body,authVaildator.loginValidation,next);
}