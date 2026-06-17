const jwt = require('jsonwebtoken');
const User = require('../models/User');


const protect = async ( req,res,next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];
            console.log('🔐 Token received:', token.substring(0, 20) + '...');
            console.log('🔑 JWT_SECRET:', process.env.JWT_SECRET);
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('✅ Token verified, decoded:', decoded);
            
            req.user = await User.findById(decoded.id).select('-password');
            next();
            return;
        }
        catch(error){
            console.log('❌ Token verification failed:', error.message);
            res.status(401).json({message: 'Not authorized, token failed'})
            return;
        }
    }

    if(!token){
        res.status(401).json({message:"Not authorization, no token"})
    }
}

module.exports = { protect }
