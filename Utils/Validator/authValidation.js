const Joi = require('joi');
const { ErrorHandler } = require('../ErrorHandler');

exports.signUpValidation = Joi.object({
  email: Joi.string().email().required().trim().messages({
    'string.email': 'Invalid email format'
  }),
  password: Joi.string()
    .min(8)
    .required()
    .pattern(new RegExp('(?=.*[!@#$%^&*(),.?":{}|<>])'))
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must include one symbol.'
    }),
  phone: Joi.string()
    .pattern(/^\d{10,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be between 10 and 15 digits'
    }),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  city: Joi.string().min(5).required(),
  state:Joi.string().optional(),
  username: Joi.string().min(3).max(30).required()
});

exports.activateAccountValidation = Joi.object({
  email: Joi.string().email().required().trim().messages({
    'string.email': 'Invalid email format'
  }),
  activationCode: Joi.string().length(4).required().messages({
    'string.length': 'Activation code must be 4 digits long'
  })
});

exports.sendActivationCodeValidation = Joi.object({
  email: Joi.string().email().required().trim().messages({
    'string.email': 'Invalid email format'
  })
});

exports.loginValidation = Joi.object({
  email: Joi.string().email().required().trim().messages({
    'string.email': 'Invalid email format'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long'
  })
});

exports.check = (obj, schema, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    return next(new ErrorHandler(error.message, 401));
  }
  next();
};