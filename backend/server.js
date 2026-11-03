const app = require("./src/app");
const connectDB = require("./src/db/db");

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("server start successfully on port 5000");
  });
});
