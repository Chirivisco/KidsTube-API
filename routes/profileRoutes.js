import express from "express";
import {
  createProfile,
  getProfiles,
  updateProfile,
  deleteProfile,
  getProfileById,
  upload,
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/", upload.single("avatar"), createProfile);
router.get("/user/:userId", getProfiles);
router.get("/:profileId", getProfileById);
router.patch("/:profileId", upload.single("avatar"), updateProfile);
router.delete("/:profileId", deleteProfile);

export default router;
