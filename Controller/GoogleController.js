
const asyncHandler=require('express-async-handler');
const userModel=require('../Model/UserModel');
const {generateToken}=require('../Utils/generateToken');

exports.googleAuth = asyncHandler(async (req, res) => {
  const { uid, email, displayName, photoURL,city } = req.body;

  let user = await userModel.findOne({ email });
 

  if (!user) {
    user = new userModel({
      email,
      username: displayName,p,
      googleId: uid,
      image: photoURL,
      isActive: true,
      phone: undefined,
      birthDay: null,
      
    });

    await user.save();
  }
user.state="اسيوط";
user.city="اسيوط";


  const token = await generateToken({ id: user._id });
  user.token = token;
  await user.save();

  res.status(200).json({ token });
});


