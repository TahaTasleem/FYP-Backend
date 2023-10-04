const Exception = require('../models/exceptionModel.js');

const logException = async (exception) =>{
    const newException = new Exception(exception);

    const exceptionAdded = await newException.save();
    if(exceptionAdded){
        return exceptionAdded;
    }
}

const raiseNotFoundException = async() =>{
    const exception = {
        statusCode: 404,
        description: "No resource found with provided ObjectId",
        loggedAt: Date.now()
    }
    const exceptionAdded = await logException(exception);
}

const raiseUnauthorizeUserException = async() =>{
    const exception = {
        statusCode: 401,
        description: "Unauthorized user hit the endpoint",
        loggedAt: Date.now()
    }
    const exceptionAdded = await logException(exception);
}

const raiseUnauthenticUserException = async() =>{
    const exception = {
        statusCode: 401,
        description: "Unauthentic user hit the endpoint",
        loggedAt: Date.now()
    }
    const exceptionAdded = await logException(exception);
}

const raiseInternalServerException = async(desc) =>{
    const exception = {
        statusCode: 500,
        description: desc,
        loggedAt: Date.now()
    }
    const exceptionAdded = await logException(exception);
}

module.exports.logException = logException;
module.exports.raiseInternalServerException = raiseInternalServerException;
module.exports.raiseNotFoundException = raiseNotFoundException;
module.exports.raiseUnauthorizeUserException = raiseUnauthorizeUserException;
module.exports.raiseUnauthenticUserException = raiseUnauthenticUserException;
