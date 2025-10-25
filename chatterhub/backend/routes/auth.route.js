import express from "express";
import {
  signupUser,
  signinUser,
  signout,
  createUserByAdmin,
  requireAuth,
  isAdmin,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.get("/signout", signout);

router.get("/me", requireAuth, (req, res) => {
  res.json({ auth: req.auth });
});

router.post("/admin/users", requireAuth, isAdmin, createUserByAdmin);

export default router;
