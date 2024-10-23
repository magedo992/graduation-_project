const mongoose = require('mongoose');
const { gender } = require('../Utils/Gender');
const bcrypt = require('bcrypt');



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
  password: {
    type: String,
    required: function() {
      return !this.googleId;  
    }
    
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,  
    
    
  },
  gender: {
    type: String,
    enum: [gender.MALE, gender.FEMALE,gender.UNKNOWN],
    required: true
  },
  image: {
    type: String,
    default: "default.png"
  },
  
  token:String,
  resetPasswordExpires:{
    type:Date,
    default:undefined
} ,isActive:{
  type:Boolean,
  default:false
},activationCode: {
  type: String,
  required: false,
}
,
city: {
  type: String,
  //required: [true, "Please enter your city"]
},
state: {
  type: String,
  //required: [true, "Please enter your state"]
},
resetPasswordToken:{
    type:String,
    default:undefined
} ,
imagePublicIds:String,
});
userSchema.pre('save', async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
