const normalizeRole = (role) =>
  typeof role === "string"
    ? role.trim().toLowerCase()
    : "";

export const isActiveUser = (user) => {
  const status =
    typeof user?.status === "string"
      ? user.status.trim().toLowerCase()
      : "";

  return status === "" || status === "active";
};

export const isAdminUser = (user) =>
  normalizeRole(user?.role) === "admin";

export const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    id: user.id || user._id?.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
    status: user.status,
    lastRoleUpdate: user.lastRoleUpdate,
  };
};

export const requireAuthentication = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (!isActiveUser(req.user)) {
    req.logout(() => {
      req.session?.destroy(() => {
        res.clearCookie(process.env.SESSION_COOKIE_NAME || "gemstone.sid");
        res.status(403).json({
          success: false,
          message: "Your account is inactive. Please contact support.",
        });
      });
    });
    return;
  }

  next();
};

export const isAdmin = (req, res, next) => {
  requireAuthentication(req, res, () => {
    if (!isAdminUser(req.user)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only",
      });
    }

    next();
  });
};
