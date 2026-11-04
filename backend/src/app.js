require("dotenv").config();
const connectDB = require("./db/db");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const userroutes = require("./routes/user.route");
const categoryroute = require("./routes/category.route")
const uploadimagerouter = require("./routes/uploadimage.route")
const subcategoryrouter = require("./routes/subcateory.route")
const productrouter = require("./routes/product.route")
const cartrouter = require("./routes/cart.route")
const Addressrouter = require("./routes/address.route")
const orderrouter = require("./routes/order.route")
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(morgan());

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

// ye frontend connct k liye h
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  }),
);


app.get("/",(req,resp)=>{
    ///server to client
    resp.json({
        message : "Server is running " + PORT
    })
})

// ye user Api k liye  h
app.use("/api/auth", userroutes);
app.use("/api/category",categoryroute)
app.use("/api/file",uploadimagerouter)
app.use("/api/subcategory",subcategoryrouter)
app.use("/api/products",productrouter)
app.use("/api/cart",cartrouter)
app.use("/api/address",Addressrouter)
app.use("/api/order",orderrouter)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("server start successfully on port 5000");
  });
});

module.exports = app;
