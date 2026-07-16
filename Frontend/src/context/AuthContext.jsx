import { createContext, useState, useEffect } from "react";
import api from "../lib/api";

export const AuthContext = createContext();

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const syncUserStorage = (user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    return;
  }

  localStorage.removeItem("user");
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  const setUser = (nextUser) => {
    setUserState(nextUser);
    syncUserStorage(nextUser);
  };

  useEffect(() => {
    let mounted = true;

    const handleStorageChange = (event) => {
      if (event.key !== "user") return;

      if (event.newValue) {
        try {
          setUserState(JSON.parse(event.newValue));
        } catch {
          setUserState(null);
        }
      } else {
        setUserState(null);
      }
    };

    const loadUser = async () => {
      if (getStoredUser()) {
        if (mounted) {
          setLoading(false);
        }
        return;
      }

      try {
        const res = await api.get("/current-user");

        if (mounted) {
          setUser(res.data.user);
        }
      } catch (error) {
        const status = error.response?.status;

        if (mounted && (status === 401 || status === 403)) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadUser();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      mounted = false;
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const logout = async () => {
    await api.post("/logout");

    setUser(null);

    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
