import React, { useState } from "react";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import api from "@/lib/axios";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuthed, setUser } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    if (!form.email.trim()) return "Vui lòng nhập email.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Email không hợp lệ.";
    if (!form.password) return "Vui lòng nhập mật khẩu.";
    if (form.password.length < 6) return "Mật khẩu tối thiểu 6 ký tự.";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      const token = data?.token;
      if (!token) throw new Error("Đăng nhập thất bại: thiếu token.");

      // Cách A: backend trả { token, user }
      if (data?.user) {
        setAuthed(token, data.user, form.remember);
      } else {
        // Cách B: không trả user -> fetch /auth/me
        setAuthed(token, null, form.remember);
        const me = await api.get("/auth/me");
        setUser(me.data);
      }

      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black relative">
      {/* background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.05) 0%, transparent 40%), linear-gradient(120deg, #0f0e17 0%, #1a1b26 100%)",
        }}
      />

      <div className="min-h-screen w-full relative z-10">
        <div className="max-w-6xl mx-auto px-4 pt-12">
          <div className="flex justify-between items-center mb-8">
            <Link className="text-white" to="/">
              Home
            </Link>
          </div>
        </div>

        {/* form */}
        <div className="w-full px-4">
          <form
            onSubmit={onSubmit}
            className="mx-auto w-full max-w-md bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-6"
          >
            <h1 className="text-3xl font-extrabold text-purple-700 text-center mb-4">
              Đăng nhập
            </h1>

            <label className="block mb-4">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white/80 p-3 outline-none focus:ring-2 focus:ring-purple-300"
                placeholder="you@email.com"
              />
            </label>

            <label className="block mb-2">
              <span>Mật khẩu</span>
              <div className="mt-1 relative">
                <input
                  type={showPw ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  className="w-full rounded-xl border border-gray-200 bg-white/80 p-3 pr-12 outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-purple-700"
                >
                  {showPw ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between mb-6">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={onChange}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-400"
                />
                <span>Ghi nhớ tôi</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <div className="flex items-center gap-3 my-6">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-xs text-gray-500">hoặc</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            <Link
              to="/register"
              className="block text-center w-full py-3 rounded-xl bg-white text-purple-700 font-medium border border-purple-200 hover:bg-purple-50 transition"
            >
              Tạo tài khoản mới
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
