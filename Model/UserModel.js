const mongoose = require('mongoose');
const { gender } = require('../Utils/Gender');
const bcrypt = require('bcrypt');
const { string, required } = require('joi');



const userSchema = new mongoose.Schema({
  fullName:{
    type:String,

  },
  username: {
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
    enum: [gender.MALE, gender.FEMALE,gender.UNKNOWN,gender.maleA,gender.FemaleA],
   
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
},
city: {
  type: String,
},
state: {
  type: String,
 
},
resetPasswordToken:{
    type:String,
    default:undefined
} ,
imagePublicIds:String,
birthDay:{
  type:Date,
  default:undefined
},plants: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Plant'
}],

});
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ googleId: 1 }, { sparse: true });
userSchema.pre('save', async function (next) {
  if (!this.isModified("password")) {
 
   
    
    return next();
  }


  this.password = await bcrypt.hash(this.password, 10);
  

  

  next();
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
