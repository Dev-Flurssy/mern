import express from "express";
import multer from "multer";
import { requireAuth, isAdmin } from "../controllers/auth.controller.js";
import userCtrl from "../controllers/user.controller.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put("/follow", requireAuth, userCtrl.addFollowing, userCtrl.addFollower);
router.put(
  "/unfollow",
  requireAuth,
  userCtrl.removeFollowing,
  userCtrl.removeFollower
);

router.get("/findpeople/:userId", requireAuth, userCtrl.findPeople);

router
  .route("/")
  .get(requireAuth, userCtrl.list)
  .post(requireAuth, isAdmin, userCtrl.create);

router.get("/defaultphoto", userCtrl.defaultPhoto);
router.get("/photo/:userId", userCtrl.photo);

router
  .route("/:userId")
  .get(requireAuth, userCtrl.read)
  .put(requireAuth, upload.single("photo"), userCtrl.update)
  .delete(requireAuth, userCtrl.remove);

router.param("userId", userCtrl.userByID);

export default router;
