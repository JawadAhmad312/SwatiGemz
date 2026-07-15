import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from "../lib/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
const from = location.state?.from?.pathname || "/";
 const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);

  try {
    const res = await api.post("/login", { username, password });

    setUser(res.data.user);

localStorage.setItem(
  "user",
  JSON.stringify(res.data.user)
);

// 🔥 update cart & wishlist immediately
window.dispatchEvent(new Event("cartUpdated"));
window.dispatchEvent(new Event("wishlistUpdated"));

navigate(from, { replace: true });

  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  }finally {
  setLoading(false);
}
};
  return (
    <div className="min-h-screen flex items-start justify-center bg-[#f4f7fb] px-4 py-12">
      <div className="w-full max-w-md rounded-[28px] bg-white border border-gray-200 shadow-[0_24px_80px_rgba(15,23,42,0.12)] p-8">

        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Login to your account to continue shopping with us.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-medium text-slate-700">
            Username or Email
            <input
              type="text"
              value={username}
              placeholder="Enter your username or email"
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#386855] focus:bg-white focus:ring-2 focus:ring-[#386855]/10"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Password
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-[#386855] focus:bg-white focus:ring-2 focus:ring-[#386855]/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition hover:text-slate-900"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#386855] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2f5846] disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-slate-600">
            Don't have an account?
            <Link to="/signup" className="ml-1 font-medium text-[#386855] hover:text-[#2f5846]">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
