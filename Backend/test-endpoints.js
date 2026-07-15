import axios from "axios";
import mongoose from "mongoose";
import User from "./models/user.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, ".env"),
});

const PORT = process.env.PORT || 8080;
const BASE_URL = `http://localhost:${PORT}`;

const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  validateStatus: () => true,
});

async function runTests() {
  console.log("=== STARTING AUTH & SECURITY REDESIGN TESTS ===");

  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/StoneGemz";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for test prep.");

    await User.deleteMany({ username: { $in: ["testcust999", "admin_attempt", "admin"] } }).catch(() => {});
    
    // Find absolute primary admin
    let adminDoc = await User.findOne({ role: "Admin" });
    if (!adminDoc) {
      console.log("No Admin found in DB. Seeding default...");
      adminDoc = new User({
        username: "admin",
        email: "admin@stonegemz.com",
        role: "Admin",
        status: "Active",
      });
      await User.register(adminDoc, "GemstoneAdmin2026");
    } else {
      console.log(`Setting password of existing Admin '${adminDoc.username}' to GemstoneAdmin2026...`);
      await adminDoc.setPassword("GemstoneAdmin2026");
      await adminDoc.save();
    }
    
    console.log(`Predefined Admin: username=${adminDoc.username}, id=${adminDoc._id}`);

    // Create a regular user for testing updates
    let customerDoc = await User.findOne({ username: "testcust999" });
    if (!customerDoc) {
      customerDoc = new User({
        username: "testcust999",
        email: "testcust999@example.com",
        role: "Customer",
        status: "Active",
      });
      await User.register(customerDoc, "Password@123");
    }
    console.log(`Test Customer: username=${customerDoc.username}, id=${customerDoc._id}`);

    // Log in as Admin to obtain session cookie
    console.log(`\nLogging in as Admin '${adminDoc.username}'...`);
    const loginRes = await client.post("/login", {
      username: adminDoc.username,
      password: "GemstoneAdmin2026",
    });

    if (loginRes.status !== 200) {
      console.error("Admin Login Failed with status:", loginRes.status, loginRes.data);
      process.exit(1);
    }
    // Save cookies from login
    const cookie = loginRes.headers["set-cookie"];
    console.log("Admin logged in successfully. Cookie obtained.");

    const requestConfig = {
      headers: {
        Cookie: cookie ? cookie.join("; ") : "",
      },
    };

    // 2. Test Signup with Reserved Username "admin" (case-insensitive)
    console.log("\nTesting signup with reserved username 'admin'...");
    const signupRes1 = await client.post("/signup", {
      username: "admin",
      email: "admin_attempt@example.com",
      password: "Password@123",
    });
    console.log(`Status code: ${signupRes1.status}`);
    console.log("Response data:", signupRes1.data);
    if (signupRes1.status === 400 && signupRes1.data.message === "Username is not available") {
      console.log("✅ Passed: Reserved username signup rejected correctly.");
    } else {
      console.error("❌ Failed: Reserved username signup was not rejected properly.");
    }

    // 3. Test Promote Customer to Admin (Should Fail)
    console.log("\nTesting Promotion of Customer to Admin...");
    const promoteRes = await client.put(`/api/users/${customerDoc._id}/role`, {
      role: "Admin",
    }, requestConfig);
    console.log(`Status code: ${promoteRes.status}`);
    console.log("Response data:", promoteRes.data);
    if (promoteRes.status === 400 && promoteRes.data.message === "Invalid role") {
      console.log("✅ Passed: Promotion to Admin role rejected with 400 correctly.");
    } else {
      console.error("❌ Failed: Promotion was not rejected correctly.");
    }

    // 4. Test Modify Existing Admin Role (Should Fail)
    console.log("\nTesting Modification of Admin account role...");
    const modifyAdminRoleRes = await client.put(`/api/users/${adminDoc._id}/role`, {
      role: "Customer",
    }, requestConfig);
    console.log(`Status code: ${modifyAdminRoleRes.status}`);
    console.log("Response data:", modifyAdminRoleRes.data);
    if (modifyAdminRoleRes.status === 403 && modifyAdminRoleRes.data.message === "Admin accounts cannot be modified via API") {
      console.log("✅ Passed: Modification of admin account role rejected with 403 correctly.");
    } else {
      console.error("❌ Failed: Modification of admin account role did not fail correctly.");
    }

    // 5. Test Modify Existing Admin Status (Should Fail)
    console.log("\nTesting Modification of Admin account status...");
    const modifyAdminStatusRes = await client.put(`/api/users/${adminDoc._id}/status`, {
      status: "Suspended",
    }, requestConfig);
    console.log(`Status code: ${modifyAdminStatusRes.status}`);
    console.log("Response data:", modifyAdminStatusRes.data);
    if (modifyAdminStatusRes.status === 403 && modifyAdminStatusRes.data.message === "Admin status cannot be modified via API") {
      console.log("✅ Passed: Modification of admin account status rejected with 403 correctly.");
    } else {
      console.error("❌ Failed: Modification of admin account status did not fail correctly.");
    }

    // 6. Test Delete Admin Account (Should Fail)
    console.log("\nTesting Deletion of Admin account...");
    const deleteAdminRes = await client.delete(`/api/users/${adminDoc._id}`, requestConfig);
    console.log(`Status code: ${deleteAdminRes.status}`);
    console.log("Response data:", deleteAdminRes.data);
    if (deleteAdminRes.status === 403 && deleteAdminRes.data.message === "Admin accounts cannot be deleted via API") {
      console.log("✅ Passed: Deletion of admin account rejected with 403 correctly.");
    } else {
      console.error("❌ Failed: Deletion of admin account did not fail correctly.");
    }

    // 7. Clean up test customer
    console.log("\nCleaning up test users...");
    await User.deleteMany({ username: "testcust999" });
    console.log("Cleaned up database records.");

  } catch (error) {
    console.error("Test execution encountered an error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n=== SECURITY REDESIGN TESTS COMPLETED ===");
  }
}

runTests();
