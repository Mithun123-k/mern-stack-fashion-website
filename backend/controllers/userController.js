const ErorrHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModels');
const sendToken = require("../utils/JwtToken")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")
const cloudinary = require("cloudinary");

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) =>{

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });

    const {name, email, password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    })

    sendToken(user, 201, res);
});

// Login User
exports.loginUser = catchAsyncErrors( async (req,res, next)=>{
    const {email, password} = req.body;
    // checking if user has given passwor and email both

    if(!email || !password){
        return next(new ErorrHandler("Please Enter Email & Password", 400))
    }
    const user = await User.findOne({ email }).select("+password");
    if(!user){
        return next(new ErorrHandler("Invalid email or Password",401));

    }
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErorrHandler("Invalid email or Password", 401))
    }

    sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) =>{
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    }); 

    res.status(200).json({
        success:true,
        message: "Logged Out",
    });
});

// Forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) =>{
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new ErorrHandler("User not Found", 404))
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`
    const message = `Your password reset Token is temp:- \n\n ${resetPasswordUrl} \n\n If You have not requested this email then please ignore it `;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Fashion world Password Recovery',
            message,
        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false})
        return next(new ErorrHandler(error.message, 500))
    }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) =>{

    // Creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    })
    if(!user){
        return next(new ErorrHandler("Reset Password Token is invalid or has been expire", 400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErorrHandler("Password does not mached", 400))
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res)
});
//  Get User Details
exports.getUserDetails = catchAsyncErrors(async (req, res, next)=>{
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
        success: true,
        user,
    });
});

//  Update User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next)=>{
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErorrHandler("Old Password is incorrect",400))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErorrHandler("Password does not matched",400))
    }
    user.password = req.body.newPassword
    await user.save()
    sendToken(user, 200, res)
    
    
});

// Update profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) =>{

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }
    
    if(req.body.avatar !== ""){
        const user = await User.findById(req.user._id);

        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });
        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    }


    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})

// Get All Users
exports.getAllUser = catchAsyncErrors(async (req, res, next)=>{
    const users = await User.find()

    res.status(200).json({
        success: true,
        users,
    })
})

// Get single User (Admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErorrHandler(`User Does Not Exist With Id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user,
    })
})

// Update user Role ---Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) =>{

    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: true
    })

    res.status(200).json({
        success: true
    })
})

// Delete user ---Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) =>{

    const user = await User.findById(req.params.id)
    
    if(!user){
        return next(new ErorrHandler(`User does not exist with id${req.params.id}`))
    }

    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);

    await user.remove();

    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    })
})