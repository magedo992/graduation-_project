const admin = require("firebase-admin");
const asyncHandler=require('express-async-handler');
const userModel=require('../Model/UserModel');
exports.googleAuth= asyncHandler(async (req, res) => {
    const idToken = req.body.idToken;
  

    

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log(decodedToken,"decodedtoken");
      
      const uid = decodedToken.uid;
      const userRecord = await admin.auth().getUser(uid);
      

})
