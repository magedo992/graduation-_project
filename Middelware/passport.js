const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User=require('../Model/UserModel');
const {generateToken}=require('../Utils/generateToken');

passport.use(new GoogleStrategy({
    clientID: process.env.Client_ID,
    clientSecret: process.env.Client_secret,
    callbackURL: `http://localhost:5858/api/auth/callback`,
    passReqToCallback: true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    try {
      const { email, name, picture } = profile._json;

      
      let user = await User.findOne({ email });

      if (!user) {
      
        user = new User({
          userName: name,        
          email,                
          password: "fromGoogle", 
          image: picture,       
          gender: 'UNKNOWN',    
          isActive: true,  
          googleId: profile.id     
        });
       
        
         
      }
      const token=await generateToken({id:user._id});
      user.token=token;
      await user.save();
    
      await user.save();
      done(null, user);
    } catch (error) {
      console.error("Error in Google OAuth strategy", error);
      done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
