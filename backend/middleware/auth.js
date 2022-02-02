const ErorrHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const Jwt = require("jsonwebtoken");
const User = require("../models/userModels")

exports.isAuthenticateUser = catchAsyncErrors(async (req, res, next) => {
    const {token} = req.cookies;
    
    if(!token){
        return next(new ErorrHandler("Please Login to access this resource", 401));
    }

    const decodedData = Jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
})
exports.authorizeRoles = (...roles) => {
    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
           return next( new ErorrHandler(`Role: ${req.user.role} is not allow to access this resource`,403))
        }
        next();
    }
}