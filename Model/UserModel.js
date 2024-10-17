const mongoose = require('mongoose');
const { gender } = require('../Utils/Gender');

const addressSchema = new mongoose.Schema({
  city: {
    type: String,
    required: [true, "Please enter your city"]
  },
  state: {
    type: String,
    required: [true, "Please enter your state"]
  }
});

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{10,15}$/.test(v); 
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] 
  },
  Password: {
    type: String,
    required:true,
    
  },
  gender: {
    type: String,
    enum: [gender.MALE, gender.FEMALE],
    required: true
  },
  image: {
    type: String,
    default: "default.png"
  },
  address: addressSchema,
  token:String,
  resetPasswordExpires:{
    type:Date,
    default:undefined
} ,
resetPasswordToken:{
    type:String,
    default:undefined
} ,
imagePublicIds:String,
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
