const mongoose = require("mongoose")
const connectDatabase = ()=> {
    mongoose.connect(process.env.Db_Url, { useNewUrlParser: true, useUnifiedTopology: true}).then((data) => {
        console.log("Mongodb connected")
    }).catch((err) => {
        console.log(err)
    })
}

module.exports = connectDatabase