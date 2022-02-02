const Order = require("../models/orderModel")
const Product = require('../models/productModel');
const ErorrHandler = require('../utils/errorhandler');
const catchAsyncError = require('../middleware/catchAsyncErrors');

exports.newOrder = catchAsyncError(async (req, res, next) => {
    const {shippingInfo, orderItems, paymentInfo, itemsPrice, texPrice, shippingPrice, totalPrice} = req.body;
    const order = await Order.create({
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemsPrice, 
        texPrice, 
        shippingPrice, 
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,
    });

    res.status(201).json({
        success: true,
        order,
    })

})

// Get single order
exports.getSingleOrder = catchAsyncError(async (req, res, next) =>{
    const order = await Order.findById(req.params.id).populate("user", "name email")
    if(!order) {
        return next(new ErorrHandler("order not found with this Id",404));
    }
    res.status(200).json({
        success:true,
        order,
    })
});
// Get logged in user Orders
exports.myOrders = catchAsyncError(async (req, res, next) =>{
    const orders = await Order.find({user: req.user._id})
    
    res.status(200).json({
        success:true,
        orders,
    })
});

// Get all Orders ---Admin
exports.getAllOrders = catchAsyncError(async (req, res, next) =>{
    const orders = await Order.find();
    
    let totalAmount = 0;
    orders.forEach(order =>{
        totalAmount += order.totalPrice
    })
    res.status(200).json({
        success:true,
        totalAmount,
        orders,
    })
});

// update Order Status ---Admin
exports.updateOrder = catchAsyncError(async (req, res, next) =>{
    const order = await Order.findById(req.params.id);

    if (!order){
        return next(new ErorrHandler("Order not found with this Id", 404));
    }
    
    if(order.orderStatus === "Delivered"){
        return next(new ErorrHandler("You have already delivered this order", 400));
    }
    if (req.body.status === 'Shipped') {
        order.orderItems.forEach( async (order) => {
            await updateStock(order.product, order.quantity);
        });
    }
    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false})
    
    
    res.status(200).json({
        success:true,
        
    })
});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.Stock -= quantity;
    await product.save({validateBeforeSave: false})
}


// Delete Order ---Admin
exports.deleteOrder = catchAsyncError(async (req, res, next) =>{
    const order = await Order.findById(req.params.id);
    
    if (!order){
        return next(new ErorrHandler("Order not found with this Id", 404));
    }

    await order.remove()
    res.status(200).json({
        success:true,
    })
});