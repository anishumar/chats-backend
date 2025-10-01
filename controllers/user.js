import auth from "../config/firebase-config.js";
import UserProfile from "../models/UserProfile.js";

export const getAllUsers = async (req, res) => {
  const maxResults = 10;
  let users = [];

  try {
    const userRecords = await auth.listUsers(maxResults);

    userRecords.users.forEach((user) => {
      const { uid, email, displayName, photoURL } = user;
      users.push({ uid, email, displayName, photoURL });
    });
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (req, res) => {
  try {
    const userRecord = await auth.getUser(req.params.userId);

    const { uid, email, displayName, photoURL } = userRecord;

    const profile = await UserProfile.findOne({ uid });
    res.status(200).json({ uid, email, displayName, photoURL, username: profile?.username });
  } catch (error) {
    console.log(error);
  }
};

export const setUsername = async (req, res) => {
  try {
    const requesterUid = req.user.uid;
    const { username } = req.body;
    if (!username || typeof username !== "string") {
      return res.status(400).json({ message: "username is required" });
    }

    const normalized = username.trim();
    if (!/^[a-zA-Z0-9_.]{3,30}$/.test(normalized)) {
      return res
        .status(400)
        .json({ message: "invalid username (3-30, letters/numbers/._)" });
    }

    const existing = await UserProfile.findOne({ usernameLower: normalized.toLowerCase() });
    if (existing && existing.uid !== requesterUid) {
      return res.status(409).json({ message: "username already taken" });
    }

    const userRecord = await auth.getUser(requesterUid);
    const profile = await UserProfile.findOneAndUpdate(
      { uid: requesterUid },
      {
        uid: requesterUid,
        username: normalized,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
      },
      { upsert: true, new: true, runValidators: true }
    );

    return res.status(200).json({ username: profile.username });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "username already taken" });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal Error" });
  }
};

export const checkUsername = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) return res.status(400).json({ available: false, reason: "missing username" });
    const existing = await UserProfile.findOne({ usernameLower: username.toLowerCase() });
    return res.status(200).json({ available: !existing });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Error" });
  }
};

export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const profile = await UserProfile.findOne({ usernameLower: username.toLowerCase() });
    if (!profile) return res.status(404).json({ message: "Not found" });

    const userRecord = await auth.getUser(profile.uid);
    const { uid, email, displayName, photoURL } = userRecord;
    return res.status(200).json({ uid, email, displayName, photoURL, username: profile.username });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Error" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const query = (q || "").toLowerCase().trim();
    if (!query) return res.status(200).json([]);

    const profiles = await UserProfile.find({ usernameLower: { $regex: `^${query}` } })
      .limit(20)
      .select("uid username");

    return res.status(200).json(profiles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Error" });
  }
};
