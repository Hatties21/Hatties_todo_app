import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { toast } from "sonner";
import { Switch } from "./ui/switch";

const THEME_KEY = "theme";

const Navbar = () => {
  const { user, isAuthed, logout } = useAuth();
  const navigate = useNavigate();

  // trạng thái công tắc
  const [checked, setChecked] = useState(false);

  // đồng bộ lần đầu (đọc từ localStorage nếu có, không thì theo <html>)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      const isDark = saved
        ? saved === "dark"
        : document.documentElement.classList.contains("dark");
      document.documentElement.classList.toggle("dark", isDark);
      setChecked(isDark);
    } catch {
      const isDark = document.documentElement.classList.contains("dark");
      setChecked(isDark);
    }
  }, []);

  const handleToggle = (v) => {
    setChecked(v);
    document.documentElement.classList.toggle("dark", v);
    try {
      localStorage.setItem(THEME_KEY, v ? "dark" : "light");
    } catch {}
  };

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công!");
    navigate("/login");
  };

  return (
    <nav className="w-full flex justify-end items-center px-8 py-4 absolute top-0 left-0">
      {!isAuthed ? (
        <>
          <Link
            to="/login"
            className="text-primary hover:opacity-80 font-semibold text-lg transition-all duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="ml-6 text-primary hover:opacity-80 font-semibold text-lg transition-all duration-200"
          >
            Register
          </Link>
        </>
      ) : (
        <div className="flex items-center gap-4">
          <span className="font-semibold text-base">
            {user?.displayName || "User"}
          </span>
          <button
            onClick={handleLogout}
            className="text-base font-medium hover:text-destructive transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      )}

      <div className="ml-4 flex items-center gap-3">
        <span>☀️</span>
        <Switch
          checked={checked}
          onCheckedChange={handleToggle}
          aria-label="Toggle dark mode"
        />
        <span>🌙</span>
      </div>
    </nav>
  );
};

export default Navbar;
