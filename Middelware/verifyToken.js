const jwt = require('jsonwebtoken');
const userModel=require('../Model/UserModel');
exports.verifay = async (req, res, next) => {
    try {
       
        const headers = req.headers.authorization;
        if (!headers ) {
            return res.status(401).json({
               
                'message': 'Authorization header is required. Please log in.'
            });
        }

        
        const token = headers.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                
                'message': 'Token is required. Please log in.'
            });
        }

      
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT);
        } catch (err) {
            return res.status(401).json({
                
                'message': 'Invalid or expired token. Please log in again.'
            });
        }

        
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
               
                'message': 'User not found.'
            });
        }

       
        if (user.token && token !== user.token) {
            return res.status(401).json({
              
                'message': 'Please log in again.'
            });
        }

        
        req.user = user;

        next();

    } catch (error) {
      
        return res.status(500).json({
           
            'message': 'Server error during authentication',
            'error': error.message
        });
    }
};