const ErorrHandler = require("../utils/errorhandler")


module.exports = (err, req, res, next) =>{

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Interanl server error";
    
    // wrong Mongodb id error
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`
        err = new ErorrHandler(message,400)
    }
    // Mongoose duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErorrHandler(message,400)
    }
    // wrong JWT error
    if(err.name === "JsonWebTokenError"){
        const message = `Json web token is invalid try again`;
        err = new ErorrHandler(message,400)
    }

    if(err.name === "JsonWebTokenError"){
        const message = `Json web token is invalid try again`;
        err = new ErorrHandler(message,400)
    }

    if(err.name === "TokenExpireedError"){
        const message = ` Json web token is expired try again `;
        err = new ErorrHandler(message,400)
    }

    res.status(err.statusCode).json({
        success:false,
        message: err.message,
    })
}