import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";

function Signup() {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!username.trim() || !email.trim() || !password.trim()) {
      return setError("All fields are required");
    }

    if (!emailPattern.test(email)) {
      return setError("Invalid email format");
    }

    if (!passwordPattern.test(password)) {
      return setError("Password must be at least 8 characters and include letters, numbers, and a special character");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8080/signup",
        { username, email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log("SUCCESS:", res.data);

      navigate("/login");

    } catch (err) {
      console.log("ERROR:", err.response?.data);

      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-[#f4f7fb] px-4 py-12">
      <div className="w-full max-w-md rounded-[28px] bg-white border border-gray-200 shadow-[0_24px_80px_rgba(15,23,42,0.12)] p-8">

        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Join now and start exploring our collection.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-medium text-slate-700">
            Username
            <input
              type="text"
              value={username}
              placeholder="Enter your username"
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#386855] focus:bg-white focus:ring-2 focus:ring-[#386855]/10"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
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

          <p className="text-sm text-slate-500">
            Password should be at least 8 characters and include letters, numbers, and a special character.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#386855] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2f5846] disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-slate-600">
            Already have an account?
            <Link to="/login" className="ml-1 font-medium text-[#386855] hover:text-[#2f5846]">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;