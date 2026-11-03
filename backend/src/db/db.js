const mongoose = require("mongoose")


require("dotenv").config();

if(!process.env.MONGODB_URI){
    throw new Error(
        "Please provide MONGODB_URI in the .env file"
    )
}


const connectDB = async ()=>{
     try {
           await mongoose.connect(process.env.MONGODB_URI)
         
          console.log("DB Connected Successfully");
     } catch (error) {
          console.error("DB Connection Error:", error);
     }
}

module.exports = connectDB