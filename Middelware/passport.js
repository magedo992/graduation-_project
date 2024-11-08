const { OAuth2Client } = require('google-auth-library');
const User = require('../Model/UserModel');
const { generateToken } = require('../Utils/generateToken');

const client = new OAuth2Client(process.env.Client_ID);

async function googleAuthHandler(req, res) {
  
  console.log(req.body);
  
  const { idToken } = req.body;
  console.log(idToken,"hello");
  try {
   
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.Client_ID,
    });
    const payload = ticket.getPayload();
    
    
    const { email, name, picture, gender } = payload;
   let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        userName: name,
        email,
        image: picture,
        password: "fromgoogle",
        gender: gender || 'UNKNOWN',
        isActive: true,
      });
    }

  
    const token = await generateToken({ id: user._id });
    user.token = token;
    await user.save();

    res.json({ token, user });
  } catch (error) {
    console.error("Error in Google OAuth handler", error);
    res.status(401).json({ message: "Authentication failed" });
  }
}

module.exports = { googleAuthHandler };