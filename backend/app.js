const express = require("express")
const cookieParser = require("cookie-parser");
const app = express();
const errorMiddleware = require("./middleware/error")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const path = require('path')


if(process.env.NODE_ENV!=="PRODUCTION"){
    
    require("dotenv").config({path: "backend/config/config.env"})
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
// Route import
const product = require("./routes/productRout")
const user =  require('./routes/userRoute')
const order = require("./routes/orderRout")
const payment = require("./routes/paymentRout")
app.use("/api/v1", product)
app.use('/api/v1', user)
app.use('/api/v1', order)
app.use('/api/v1', payment)

app.use(express.static(path.join(__dirname, "../frontend/build")))

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"))
})

// Middleware for error
app.use(errorMiddleware);

module.exports = app