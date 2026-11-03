const mongoose = require("mongoose")

const subcategorySchema = new mongoose.Schema({
     name : {
        type : String,
        default : ""
    },
    image : {
        type : String,
        default : ""
    },
    category : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "category"
        }
    ]
},{
    timestamps : true
})

const subcategorymodel = mongoose.model("subcategory", subcategorySchema)

module.exports = subcategorymodel