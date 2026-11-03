const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
     name : {
        type : String,
        default : ""
    },
    image : {
        type : String,
        default : ""
    }
},{
    timestamps : true
})


const categorymodel = mongoose.model("category",categorySchema)

module.exports = categorymodel