const db = require("mongoose");

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URL;
  if (!mongoURI) {
    return;
  }

  try {
    await db.connect(mongoURI);
  } catch (error) {}
};

module.exports = connectDB;
