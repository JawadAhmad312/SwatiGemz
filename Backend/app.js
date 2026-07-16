import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import MongoStore from "connect-mongo";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import http from "http";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { isAdmin, isActiveUser, sanitizeUser } from "./middleware/admin.js";
import Stone from "./models/stone.js";
import Review from "./models/reviews.js";
import MenRing from "./models/menrings.js";
import Necklaces from "./models/necklaces.js";
import Earring from "./models/earring.js";
import WomenCategory from "./models/womencategory.js";
import MenCategory from "./models/mencategory.js";
import WomenRing from "./models/womenring.js";
import PrivacyForm from "./models/privacyform.js";
import User from "./models/user.js";
import Order from "./models/order.js";
import Gemstone from "./models/Gemstone.js";
import GemCollection from "./models/Collection.js";
import { connectSocket } from "./sockets/socket.js";
import stoneRoutes from "./routes/stoneRoutes.js";
import menRingRoutes from "./routes/menRingRoutes.js";
import womenRingRoutes from "./routes/womenRingRoutes.js";
import necklaceRoutes from "./routes/necklaceRoutes.js";
import earringRoutes from "./routes/earringRoutes.js";
import menCategoryRoutes from "./routes/menCategoryRoutes.js";
import womenCategoryRoutes from "./routes/womenCategoryRoutes.js";
import gemstoneRoutes from "./routes/gemstoneRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, ".env"),
});

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;
const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/StoneGemz";
const MONGO_DB_NAME =
  process.env.MONGO_DB_NAME || "StoneGemz";
const CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN ||
  process.env.FRONTEND_URL ||
  "http://localhost:5173";
const SESSION_SECRET = process.env.SESSION_SECRET;
const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME || "gemstone.sid";
const SESSION_TTL_DAYS = Math.max(
  Number.parseInt(process.env.SESSION_TTL_DAYS || "30", 10) || 30,
  1
);
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const IS_LOCAL_ORIGIN = /http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(
  CLIENT_ORIGIN
);
const USE_SECURE_COOKIES =
  process.env.SESSION_COOKIE_SECURE === "true" ||
  (IS_PRODUCTION && !IS_LOCAL_ORIGIN);
const SESSION_SAME_SITE =
  process.env.SESSION_COOKIE_SAME_SITE ||
  (USE_SECURE_COOKIES ? "none" : "lax");

const normalizeOrigin = (origin) => {
  if (!origin || origin === "*") {
    return null;
  }

  const trimmed = origin.trim().replace(/\/$/, "");

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
]
  .flatMap((value) =>
    String(value || "")
      .split(",")
      .map(normalizeOrigin)
      .filter(Boolean)
  )
  .filter((origin, index, list) => list.indexOf(origin) === index);

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

if (!SESSION_SECRET) {
  throw new Error(
    "SESSION_SECRET is required to start the server securely."
  );
}

const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many accounts created. Try again later.",
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many login attempts. Try again later.",
});

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const sessionOptions = {
  name: SESSION_COOKIE_NAME,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  proxy: USE_SECURE_COOKIES,
  store: MongoStore.create({
  mongoUrl: buildMongoUri(MONGO_URI, MONGO_DB_NAME),
    collectionName: "sessions",
    ttl: SESSION_TTL_DAYS * 24 * 60 * 60,
    autoRemove: "native",
    touchAfter: 24 * 60 * 60,
  }),
  cookie: {
    httpOnly: true,
    secure: USE_SECURE_COOKIES,
    sameSite: SESSION_SAME_SITE,
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
  },
};

const sessionMiddleware = session(sessionOptions);

connectSocket(server, {
  corsOrigin: allowedOrigins,
  sessionMiddleware,
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use("/uploads", express.static("uploads"));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const normalizedLogin = username.trim().toLowerCase();
      const user = await User.findOne({
        $or: [
          { username: normalizedLogin },
          { email: normalizedLogin },
        ],
      });

      if (!user) {
        return done(null, false, {
          message: "Invalid username/email or password",
        });
      }

      const { user: authenticatedUser, error } =
        await user.authenticate(password);

      if (error || !authenticatedUser) {
        return done(null, false, {
          message: "Invalid username/email or password",
        });
      }

      return done(null, authenticatedUser);
    } catch (error) {
      return done(error);
    }
  })
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose
  .connect(buildMongoUri(MONGO_URI, MONGO_DB_NAME), {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

app.get("/debug-auth", (req, res) => {
  res.json({
    user: sanitizeUser(req.user),
    sessionID: req.sessionID,
    authenticated: req.isAuthenticated(),
  });
});

app.use("/api/stone", stoneRoutes);
app.use("/api/menrings", menRingRoutes);
app.use("/api/womenrings", womenRingRoutes);
app.use("/api/necklace", necklaceRoutes);
app.use("/api/earrings", earringRoutes);
app.use("/api/women", womenCategoryRoutes);
app.use("/api/men", menCategoryRoutes);
app.use("/api/gemstones", gemstoneRoutes);
app.use("/api/gem-collections", collectionRoutes);
app.use("/api/orders", orderRoutes);

app.post("/api/cart", async (req, res) => {
  const product = await Stone.findById(req.body.id);

  if (!product || product.stockquantity <= 0) {
    return res.status(400).json({ message: "Out of stock" });
  }

  res.json({ success: true });
});

app.post("/listing/:id/review", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: "You must be logged in first",
    });
  }

  try {
    const listing = await Stone.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const newReview = new Review({
      rating: req.body.rating,
      comment: req.body.comment,
    });
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.status(201).json({ newReview });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/gemstones/collection/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const {
      sort,
      availability,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
    } = req.query;

    const collection = await GemCollection.findOne({ slug });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    const query = {
      gemCollection: collection._id,
    };

    if (availability === "in-stock") {
      query.stockquantity = { $gt: 0 };
    }

    if (availability === "sold-out") {
      query.stockquantity = 0;
    }

    if (minPrice || maxPrice) {
      query.salePrice = {};

      if (minPrice) {
        query.salePrice.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.salePrice.$lte = Number(maxPrice);
      }
    }

    let sortOption = {};

    switch (sort) {
      case "price-low-high":
        sortOption.salePrice = 1;
        break;
      case "price-high-low":
        sortOption.salePrice = -1;
        break;
      case "a-z":
        sortOption.name = 1;
        break;
      case "z-a":
        sortOption.name = -1;
        break;
      default:
        sortOption.createdAt = -1;
    }

    const skip = (page - 1) * limit;

    const gemstones = await Gemstone.find(query)
      .populate("gemCollection")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const totalProducts = await Gemstone.countDocuments(query);

    res.status(200).json({
      success: true,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      gemstones,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.get("/api/check-auth", (req, res) => {
  if (req.isAuthenticated() && req.user && isActiveUser(req.user)) {
    return res.json({
      loggedIn: true,
      user: sanitizeUser(req.user),
    });
  }

  res.json({
    loggedIn: false,
  });
});

app.get("/admin/dashboard", isAdmin, async (req, res) => {
  try {
    const rings = await MenRing.countDocuments();
    const women = await WomenRing.countDocuments();
    const stones = await Stone.countDocuments();
    const earrings = await Earring.countDocuments();
    const necklaces = await Necklaces.countDocuments();
    const collections = await GemCollection.countDocuments();
    const gemstones = await Gemstone.countDocuments();
    const users = await User.countDocuments();

    const totalProducts =
      rings + women + necklaces + earrings + stones + gemstones;

    const orders = await Order.countDocuments().catch(() => 0);

    const revenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]).catch(() => []);

    const revenue = revenueData[0]?.total || 0;

    const now = new Date();
    const last7 = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const prev7 = new Date(now - 14 * 24 * 60 * 60 * 1000);

    const lastWeek = await Order.aggregate([
      { $match: { createdAt: { $gte: last7 } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]).catch(() => []);

    const prevWeek = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: prev7, $lt: last7 },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]).catch(() => []);

    const last = lastWeek[0]?.total || 0;
    const prev = prevWeek[0]?.total || 0;

    const growth =
      prev === 0 ? 0 : (((last - prev) / prev) * 100).toFixed(2);
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: {
        rings,
        women,
        necklaces,
        earrings,
        stones,
        gemstones,
        collections,
        users,
        totalProducts,
        orders,
        revenue,
        growth,
      },
      recentOrders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/admin/sales-chart", isAdmin, async (req, res) => {
  try {
    const { range = "monthly" } = req.query;

    const now = new Date();
    let startDate = new Date();
    let groupExpr;

    if (range === "today") {
      startDate.setHours(0, 0, 0, 0);
      groupExpr = { $hour: "$createdAt" };
    } else if (range === "annual") {
      startDate = new Date(now.getFullYear(), 0, 1);
      groupExpr = { $month: "$createdAt" };
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      groupExpr = { $dayOfMonth: "$createdAt" };
    }

    const agg = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: groupExpr,
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const data = agg.map((d) => ({
      day: Object.values(d._id)[0],
      revenue: d.revenue || 0,
      orders: d.orders || 0,
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/admin/top-products", isAdmin, async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          category: "$product.category",
          price: "$product.price",
          stock: "$product.stockquantity",
          totalSold: 1,
        },
      },
    ]);

    res.json(topProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/privacy-form", async (req, res) => {
  try {
    const form = new PrivacyForm(req.body);
    await form.save();

    res.json({
      success: true,
      message: "Form submitted successfully",
    });
  } catch (err) {
    console.log("SERVER ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.post(
  "/signup",
  signupLimiter,
  [
    body("username").trim().notEmpty().withMessage("Username required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password } = req.body;
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedUsername = username.trim();

      const reservedUsernames = ["admin", (process.env.ADMIN_USERNAME || "admin").toLowerCase()];
      if (reservedUsernames.includes(normalizedUsername.toLowerCase())) {
        return res.status(400).json({
          message: "Username is not available",
        });
      }

      const existingUser = await User.findOne({
        $or: [
          { email: normalizedEmail },
          { username: normalizedUsername.toLowerCase() },
        ],
      });

      if (existingUser) {
        return res.status(400).json({
          message: "A user with that email or username already exists",
        });
      }

      const newUser = new User({
        username: normalizedUsername,
        email: normalizedEmail,
      });

      const registeredUser = await User.register(newUser, password);

      return res.status(201).json({
        message: "User registered successfully",
        user: sanitizeUser(registeredUser),
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
);

app.get("/api/search", async (req, res) => {
  const { q } = req.query;

  const [stones, rings, necklaces, earrings] = await Promise.all([
    Stone.find({ name: new RegExp(q, "i") }),
    MenRing.find({ name: new RegExp(q, "i") }),
    Necklaces.find({ name: new RegExp(q, "i") }),
    Earring.find({ name: new RegExp(q, "i") }),
  ]);

  const results = [
    ...stones.map((i) => ({ ...i._doc, type: "stone" })),
    ...rings.map((i) => ({ ...i._doc, type: "menrings" })),
    ...necklaces.map((i) => ({ ...i._doc, type: "necklace" })),
    ...earrings.map((i) => ({ ...i._doc, type: "earrings" })),
  ];

  res.json(results);
});

app.post("/login", loginLimiter, (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return res.status(500).json({
        message: "Server error",
      });
    }

    if (!user) {
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }

    if (!isActiveUser(user)) {
      return res.status(403).json({
        message: "Your account is inactive. Please contact support.",
      });
    }

    req.session.regenerate((sessionErr) => {
      if (sessionErr) {
        return res.status(500).json({
          message: "Login failed",
        });
      }

      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({
            message: "Login failed",
          });
        }

        return res.status(200).json({
          message: "Login successful",
          user: sanitizeUser(user),
        });
      });
    });
  })(req, res, next);
});

app.post("/logout", (req, res) => {
  req.logout((logoutErr) => {
    if (logoutErr) {
      return res.status(500).json({
        message: "Logout failed",
      });
    }

    req.session.destroy(() => {
      res.clearCookie(SESSION_COOKIE_NAME);
      return res.status(200).json({
        message: "Logged out successfully",
      });
    });
  });
});

app.get("/current-user", (req, res) => {
  if (!req.user || !isActiveUser(req.user)) {
    return res.status(401).json({
      authenticated: false,
    });
  }

  res.json({
    authenticated: true,
    user: sanitizeUser(req.user),
  });
});

app.get("/users", isAdmin, async (req, res) => {
  try {
    const users = await User.find().select(
      "username email role status lastRoleUpdate createdAt updatedAt"
    );

    res.json({
      success: true,
      users,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/users/:id", isAdmin, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser.role === "Admin") {
      return res.status(403).json({ message: "Admin accounts cannot be deleted via API" });
    }

    await targetUser.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/users/:id/role", isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = [
      "Manager",
      "Moderator",
      "Support",
      "Security",
      "Customer",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (targetUser.role === "Admin") {
      return res.status(403).json({
        success: false,
        message: "Admin accounts cannot be modified via API",
      });
    }

    targetUser.role = role;
    targetUser.lastRoleUpdate = new Date();
    await targetUser.save();

    const responseUser = {
      _id: targetUser._id,
      username: targetUser.username,
      email: targetUser.email,
      role: targetUser.role,
      status: targetUser.status,
      lastRoleUpdate: targetUser.lastRoleUpdate,
      createdAt: targetUser.createdAt,
      updatedAt: targetUser.updatedAt,
    };

    res.json({
      success: true,
      message: "Role Updated Successfully",
      user: responseUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.put("/api/users/:id/status", isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["Active", "Inactive", "Suspended"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (targetUser.role === "Admin") {
      return res.status(403).json({
        success: false,
        message: "Admin status cannot be modified via API",
      });
    }

    targetUser.status = status;
    await targetUser.save();

    const responseUser = {
      _id: targetUser._id,
      username: targetUser.username,
      email: targetUser.email,
      role: targetUser.role,
      status: targetUser.status,
      lastRoleUpdate: targetUser.lastRoleUpdate,
      createdAt: targetUser.createdAt,
      updatedAt: targetUser.updatedAt,
    };

    res.json({
      success: true,
      user: responseUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send("Server Working successfully");
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Stop the existing backend process or change PORT before starting a second server.`
    );
    process.exit(1);
  }

  console.error("Server failed to start:", error);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
