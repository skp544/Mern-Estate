import express from "express";
import {
  deleteUser,
  getNotificationNumber,
  getUser,
  getUsers,
  profilePosts,
  savePost,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/get/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/save", verifyToken, savePost);
router.get("/profile-posts", verifyToken, profilePosts);
router.get("/notification", verifyToken, getNotificationNumber);

export default router;
