import express from "express";
import {
  getAllUsers,
  getUser,
  setUsername,
  checkUsername,
  getUserByUsername,
  searchUsers,
} from "../../controllers/user.js";

const router = express.Router();

// list + search (supports ?search=term)
router.get("/users", (req, res, next) => {
  if (req.query.search) return searchUsers(req, res, next);
  return getAllUsers(req, res, next);
});

// single
router.get("/users/:userId", getUser);
router.get("/users/by-username/:username", getUserByUsername);

// username management
router.patch("/users/me/username", setUsername);
router.get("/usernames/check", checkUsername);

export default router;
