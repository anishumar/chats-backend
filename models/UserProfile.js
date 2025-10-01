import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, index: true, unique: true },
    username: { type: String, required: true, unique: true },
    usernameLower: { type: String, required: true, unique: true, index: true },
    displayName: { type: String },
    photoURL: { type: String },
  },
  { timestamps: true }
);

UserProfileSchema.pre("validate", function (next) {
  if (this.username) {
    this.usernameLower = this.username.toLowerCase();
  }
  next();
});

UserProfileSchema.index({ usernameLower: 1 }, { unique: true });
UserProfileSchema.index({ uid: 1 }, { unique: true });

const UserProfile = mongoose.model("UserProfile", UserProfileSchema);
export default UserProfile;
