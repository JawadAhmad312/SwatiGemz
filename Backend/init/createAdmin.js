import mongoose from "mongoose";
import User from "../models/user.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "..", ".env"),
});

const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/StoneGemz";
const MONGO_DB_NAME =
  process.env.MONGO_DB_NAME || "StoneGemz";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@stonegemz.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "GemstoneAdmin2026";

const buildMongoUri = (rawUri, dbName) => {
  const trimmedUri = rawUri.trim();
  const [baseUri, queryString] = trimmedUri.split("?");
  const normalizedBaseUri = baseUri.endsWith("/")
    ? baseUri.slice(0, -1)
    : baseUri;
  const databasePath =
    normalizedBaseUri.includes("mongodb+srv://") &&
    !normalizedBaseUri.endsWith(`/${dbName}`)
      ? `${normalizedBaseUri}/${dbName}`
      : normalizedBaseUri;
  const searchParams = new URLSearchParams(queryString || "");

  if (!searchParams.has("retryWrites")) {
    searchParams.set("retryWrites", "true");
  }

  if (!searchParams.has("w")) {
    searchParams.set("w", "majority");
  }

  if (!searchParams.has("authSource")) {
    searchParams.set("authSource", "admin");
  }

  if (!searchParams.has("appName")) {
    searchParams.set("appName", "GemStone");
  }

  return `${databasePath}?${searchParams.toString()}`;
};

const createAdminAccount = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(buildMongoUri(MONGODB_URI, MONGO_DB_NAME), {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log("Connected to DB");

    const existingAdmin = await User.findOne({
      username: ADMIN_USERNAME,
    });

    if (existingAdmin) {
      existingAdmin.email = ADMIN_EMAIL;
      existingAdmin.role = "Admin";
      existingAdmin.status = "Active";

      await existingAdmin.setPassword(ADMIN_PASSWORD);
      await existingAdmin.save();

      console.log("Admin account updated successfully!");
      console.log("========================================");
      console.log("ADMIN CREDENTIALS:");
      console.log("========================================");
      console.log(`Username: ${ADMIN_USERNAME}`);
      console.log(`Email: ${ADMIN_EMAIL}`);
      console.log(`Password: ${ADMIN_PASSWORD}`);
      console.log(`Role: ${existingAdmin.role}`);
      console.log("========================================");
      console.log("Keep these credentials safe!");
      console.log("You can now login and access the admin dashboard.");
      console.log("========================================");

      await mongoose.connection.close();
      process.exit(0);
    }

    const adminUser = new User({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      role: "Admin",
      status: "Active",
    });

    const registeredAdmin = await User.register(adminUser, ADMIN_PASSWORD);

    console.log("Admin account created successfully!");
    console.log("========================================");
    console.log("ADMIN CREDENTIALS:");
    console.log("========================================");
    console.log(`Username: ${ADMIN_USERNAME}`);
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log(`Role: ${registeredAdmin.role}`);
    console.log("========================================");
    console.log("Keep these credentials safe!");
    console.log("You can now login and access the admin dashboard.");
    console.log("========================================");

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin account:", err);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdminAccount();
