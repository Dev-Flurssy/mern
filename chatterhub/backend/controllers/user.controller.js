import mongoose from "mongoose";
import User from "../models/user.model.js";
import extend from "lodash/extend.js";
import errorHandler from "../helpers/dbErrorHandler.js";
import path from "path";
import fs from "fs";

const __dirname = path.resolve();

const sanitizeUser = (user) => {
  if (!user) return null;
  const obj = user.toObject ? user.toObject() : user;
  return {
    _id: obj._id,
    name: obj.name,
    email: obj.email,
    role: obj.role,
    about: obj.about,
    profilePic: obj.profilePic,
    following: obj.following,
    followers: obj.followers,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

const create = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(sanitizeUser(user));
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const list = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users.map(sanitizeUser));
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const userByID = async (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: `Invalid user ID: ${id}` });
  }
  try {
    const user = await User.findById(id)
      .populate("following", "_id name")
      .populate("followers", "_id name")
      .exec();
    if (!user) return res.status(404).json({ error: "User not found" });
    req.profile = user;
    next();
  } catch (err) {
    return res.status(500).json({ error: "Could not retrieve user" });
  }
};

const read = (req, res) => res.json(sanitizeUser(req.profile));

const addFollowing = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, {
      $push: { following: req.body.followId },
    });
    next();
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const addFollower = async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(
      req.body.followId,
      { $push: { followers: req.body.userId } },
      { new: true }
    )
      .populate("following", "_id name")
      .populate("followers", "_id name")
      .exec();

    res.json(sanitizeUser(result));
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const findPeople = async (req, res) => {
  let following = req.profile.following;
  following.push(req.profile._id);

  try {
    let users = await User.find({ _id: { $nin: following } }).select("name");
    res.json(users);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const removeFollowing = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, {
      $pull: { following: req.body.unfollowId },
    });
    next();
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const removeFollower = async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(
      req.body.unfollowId,
      { $pull: { followers: req.body.userId } },
      { new: true }
    )
      .populate("following", "_id name")
      .populate("followers", "_id name")
      .exec();

    res.json(sanitizeUser(result));
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const photo = (req, res) => {
  const user = req.profile;
  if (user?.profilePic) {
    const photoPath = path.join(__dirname, "public", user.profilePic);
    if (fs.existsSync(photoPath)) return res.sendFile(photoPath);
  }
  const defaultPath = path.join(__dirname, "public/uploads/defaultphoto.png");
  if (fs.existsSync(defaultPath)) return res.sendFile(defaultPath);

  const transparentPng = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AArsB9VVpHgAAAABJRU5ErkJggg==",
    "base64"
  );
  res.set("Content-Type", "image/png");
  return res.send(transparentPng);
};

const defaultPhoto = (req, res) => {
  const defaultPath = path.join(__dirname, "public/uploads/defaultphoto.png");
  if (fs.existsSync(defaultPath)) return res.sendFile(defaultPath);

  const transparentPng = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AArsB9VVpHgAAAABJRU5ErkJggg==",
    "base64"
  );
  res.set("Content-Type", "image/png");
  return res.send(transparentPng);
};

const update = async (req, res) => {
  try {
    let user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    Object.assign(user, req.body);
    if (req.file) {
      const uploadPath = path.join(
        __dirname,
        "public/uploads",
        `${user._id}.jpg`
      );
      fs.writeFileSync(uploadPath, req.file.buffer);
      user.profilePic = `uploads/${user._id}.jpg`;
    }

    user.updatedAt = Date.now();
    await user.save();
    res.json(sanitizeUser(user));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const deletedUser = sanitizeUser(req.profile);
    await req.profile.deleteOne();
    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default {
  create,
  list,
  userByID,
  read,
  update,
  remove,
  photo,
  defaultPhoto,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
  findPeople,
};
