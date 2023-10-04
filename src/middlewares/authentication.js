const jwt = require('jsonwebtoken');

const {raiseUnauthenticUserException} = require('../utils/exceptionLogger.js');

const isAuthenticUser = async (req, res, next) =>{
    const {token} = req.cookies;
    if(!token){
        const exc = await raiseUnauthenticUserException();
        return res.status(401).json({'message':"Please login to continue!"});    
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    next();
}

module.exports.isAuthenticUser = isAuthenticUser;
