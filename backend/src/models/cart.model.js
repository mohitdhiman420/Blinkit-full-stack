const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
     productId : {
        type : mongoose.Schema.ObjectId,
        ref : 'product'
    },
    quantity : {
        type : Number,
        default : 1
    },
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : "user"
    }
},{
    timestamps : true

})

const cartmodel = mongoose.model("cartProduct",cartSchema)

module.exports = cartmodel