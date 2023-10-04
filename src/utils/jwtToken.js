const dotenv = require('dotenv');
dotenv.config({path:'./config/.env'});
const jwt = require('jsonwebtoken');

const sendToken = async (userPayload) => {
    if(userPayload){
        const token = jwt.sign(userPayload, process.env.JWT_SECRET);
        return token;
    }

}

module.exports.getToken = sendToken;