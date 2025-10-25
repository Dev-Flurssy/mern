import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (adminExists) {
      console.log("⚠️ Admin already exists:", process.env.ADMIN_EMAIL);
      process.exit(0);
    }

    const admin = await User.signup(
      process.env.ADMIN_NAME,
      process.env.ADMIN_EMAIL,
      process.env.ADMIN_PASSWORD,
      "admin"
    );

    console.log(`✅ Admin created with email: ${admin.email}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
    process.exit(1);
  }
};

createAdmin();
