
require("dotenv").config();

const connectDB = require("./db/db");
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();

const userroutes = require("./routes/user.route");
const categoryroute = require("./routes/category.route");
const uploadimagerouter = require("./routes/uploadimage.route");
const subcategoryrouter = require("./routes/subcateory.route");
const productrouter = require("./routes/product.route");
const cartrouter = require("./routes/cart.route");
const Addressrouter = require("./routes/address.route");
const orderrouter = require("./routes/order.route");

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);

app.get("/", (req, res) => {
  res.json({
    message: "Blinkit Backend is running successfully",
  });
});

app.use("/api/auth", userroutes);
app.use("/api/category", categoryroute);
app.use("/api/file", uploadimagerouter);
app.use("/api/subcategory", subcategoryrouter);
app.use("/api/products", productrouter);
app.use("/api/cart", cartrouter);
app.use("/api/address", Addressrouter);
app.use("/api/order", orderrouter);

// Connect DB before exporting app
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

module.exports = app;
