const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const connectDB = require("./config/db");
const app = express();

app.use(express.json());
app.use(morgan("dev"));

connectDB();

app.use("/api/v1/user", require("./routes/userRouter"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));

// Serve static assets if in production
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

const port = process.env.PORT || 2000;

app.listen(port, () => {
  console.log("Server running on port", port);
});
