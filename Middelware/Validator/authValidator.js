const authValidate=require('../../Utils/Validator/authValidation');


exports.login=(req,res,next)=>{
    authValidate.check(req.body,authValidate.loginValidation,next)
}

exports.signup=(req,res,next)=>{
    authValidate.check(req.body,authValidate.signUpValidation,next)

}

exports.activateAccount=(req,res,next)=>{
    authValidate.check(req.body,authValidate.activateAccountValidation,next)
}

exports.sendActivationCode=(req,res,next)=>{
    authValidate.check(req.body,authValidate.sendActivationCodeValidation,next)
}