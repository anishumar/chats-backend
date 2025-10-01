import express from "express";

import {
  getAllUsers,
  getUser,
  setUsername,
  checkUsername,
  getUserByUsername,
  searchUsers,
} from "../controllers/user.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:userId", getUser);
router.post("/username", setUsername);
router.get("/check-username", checkUsername);
router.get("/by-username/:username", getUserByUsername);
router.get("/search", searchUsers);

export default router;
