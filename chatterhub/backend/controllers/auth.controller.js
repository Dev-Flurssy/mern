import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import errorHandler from "../helpers/dbErrorHandler.js";

const createToken = (user) => {
  return jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const signupUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.signup(name, email, password);
    const token = createToken(user);

    res.status(201).json({
      message: "Signup successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (err) {
    res
      .status(400)
      .json({ error: err.message || errorHandler.getErrorMessage(err) });
  }
};

const signinUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.signin(email, password);
    const token = createToken(user);

    res.cookie("t", token, { httpOnly: true, sameSite: "strict" });

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    return res.status(400).json({ error: err.message || "Could not sign in" });
  }
};

const signout = (req, res) => {
  res.clearCookie("t");
  return res.json({ message: "Signed out successfully" });
};

const createUserByAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await User.signup(name, email, password, role || "user");
    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res
      .status(400)
      .json({ error: err.message || errorHandler.getErrorMessage(err) });
  }
};

const requireAuth = (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.t) {
      token = req.cookies.t;
    }

    if (!token) {
      return res.status(401).json({ error: "Authorization required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = decoded;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

const hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile && req.auth && req.profile._id.toString() === req.auth._id;
  if (!authorized) {
    return res.status(403).json({ error: "User is not authorized" });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (!req.auth || req.auth.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

export {
  signupUser,
  signinUser,
  signout,
  createUserByAdmin,
  requireAuth,
  hasAuthorization,
  isAdmin,
  createToken,
};
