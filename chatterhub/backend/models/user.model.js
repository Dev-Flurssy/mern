import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import dayjs from "dayjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: "Name is required" },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: "Email already exists",
      required: "Email is required",
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "Please enter a valid email address",
      },
    },
    hashed_password: {
      type: String,
      required: "Password is required",
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    about: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    profilePic: {
      type: String,
      default: function () {
        return Math.random() > 0.5
          ? "/uploads/chatter-male-1.png"
          : "/uploads/chatter-female-1.png";
      },
    },
    following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true }
);

userSchema.methods.authenticate = async function (plainText) {
  return await bcrypt.compare(plainText, this.hashed_password);
};

userSchema.methods.formatDates = function () {
  return {
    createdAt: dayjs(this.createdAt).format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: dayjs(this.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
  };
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.hashed_password;
  delete obj.resetToken;
  delete obj.resetTokenExpiry;
  return obj;
};

userSchema.statics.signup = async function (
  name,
  email,
  password,
  role = "user"
) {
  try {
    const exists = await this.findOne({ email });
    if (exists) throw new Error("Email already registered");

    if (
      !validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 0,
        minUppercase: 0,
      })
    ) {
      throw new Error(
        "Password must be at least 6 characters and contain at least 1 number"
      );
    }

    const hashed_password = await bcrypt.hash(password, 10);

    return await this.create({
      name,
      email,
      hashed_password,
      role,
    });
  } catch (err) {
    if (err.code === 11000) {
      throw new Error("Email already registered");
    }
    throw err;
  }
};

userSchema.statics.signin = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("Incorrect email or password");

  const match = await bcrypt.compare(password, user.hashed_password);
  if (!match) throw new Error("Incorrect email or password");

  if (user.status !== "active") {
    throw new Error("Account is suspended. Contact support.");
  }

  return user;
};

export default mongoose.model("User", userSchema);
