import express from "express";
import multer from "multer";
import { requireAuth } from "../controllers/auth.controller.js";
import postCtrl from "../controllers/post.controller.js";

const router = express.Router();

// Setup multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// PARAM middleware
router.param("postId", postCtrl.postByID);
router.param("userId", postCtrl.userByID);

// POST routes
router.post("/create", requireAuth, upload.single("photo"), postCtrl.create);

// GET routes
router.get("/", requireAuth, postCtrl.list); // list user-specific posts (if used)
router.get("/feed/:userId", requireAuth, postCtrl.listNewsFeed); // personalized feed
router.get("/all", postCtrl.listAll); // ✅ global feed route (no double prefix)
router.get("/by/:userId", requireAuth, postCtrl.postsByUser);
router.get("/photo/:postId", postCtrl.photo);

// PUT routes
router.put("/like", requireAuth, postCtrl.like);
router.put("/unlike", requireAuth, postCtrl.unlike);
router.put("/comment", requireAuth, postCtrl.comment);
router.put("/uncomment", requireAuth, postCtrl.uncomment);

// DELETE & READ routes
router
  .route("/:postId")
  .get(requireAuth, postCtrl.read)
  .delete(requireAuth, postCtrl.isPoster, postCtrl.remove);

export default router;
