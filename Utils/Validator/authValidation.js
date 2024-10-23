const Joi = require('joi');

exports.signUpValidation = Joi.object({
  email: Joi.string().email().required().trim().message('Invalid email format'),
  password: Joi.string()
    .min(8)
    .required()
    .pattern(new RegExp('(?=.*[a-z])')) 
    .pattern(new RegExp('(?=.*[A-Z])')) 
    .pattern(new RegExp('(?=.*[!@#$%^&*(),.?":{}|<>])')) 
    .message('Password must be at least 8 characters long and include one uppercase, one lowercase letter, and one symbol.'),
  phone: Joi.string().pattern(/^\d{10,15}$/).required().message('Phone number must be between 10 and 15 digits'),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  address: Joi.string().min(5).required(),
  username: Joi.string().min(3).max(30).required()
});

exports.activateAccountValidation = Joi.object({
  email: Joi.string().email().required().trim().message('Invalid email format'),
  activationCode: Joi.string().length(4).required().message('Activation code must be 4 digits long')
});

exports.sendActivationCodeValidation = Joi.object({
  email: Joi.string().email().required().trim().message('Invalid email format')
});

exports.loginValidation = Joi.object({
  email: Joi.string().email().required().trim().message('Invalid email format'),
  password: Joi.string().min(8).required().message('Password must be at least 8 characters long')
});

exports.check = (schema) => {
    return (req, res, next) => {
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      next();
    };
  };
  
