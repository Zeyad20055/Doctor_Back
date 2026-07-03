const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db.js");
const userRoute = require("./Routes/user.route.js");
const doctourRoute = require("./Routes/doctour.route.js");
const appointRoute = require("./Routes/appoint.route.js");
const departmentRoute = require("./Routes/department.route.js");
const app = express();

app.use(express.json());
app.use(cors());
app.use("/user", userRoute);
app.use("/doctours", doctourRoute);
app.use("/appointments", appointRoute);
app.use("/departments", departmentRoute);

app.use("/files", express.static("uploads"));

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});