import mongoose from "mongoose";
const Schema = mongoose.Schema;
import passportLocalMongoose from "passport-local-mongoose";

const ROLE_VALUES = [
  "Admin",
  "Manager",
  "Moderator",
  "Support",
  "Security",
  "Customer",
];

const STATUS_VALUES = [
  "Active",
  "Inactive",
  "Suspended",
];

const normalizeRole = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  const normalized = value.trim().toLowerCase();

  return (
    ROLE_VALUES.find(
      (role) => role.toLowerCase() === normalized
    ) || value.trim()
  );
};

const normalizeStatus = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  const normalized = value.trim().toLowerCase();

  return (
    STATUS_VALUES.find(
      (status) => status.toLowerCase() === normalized
    ) || value.trim()
  );
};

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    role: {
      type: String,
      enum: ROLE_VALUES,
      default: "Customer",
      set: normalizeRole,
    },

    status: {
      type: String,
      enum: STATUS_VALUES,
      default: "Active",
      set: normalizeStatus,
    },

    lastRoleUpdate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(
  passportLocalMongoose.default || passportLocalMongoose,
  {
    usernameLowerCase: true,
    usernameUnique: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
