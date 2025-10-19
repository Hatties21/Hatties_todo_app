import React, { useState } from "react";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import api from "@/lib/axios";

export default function RegisterPage() {
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    password: "",
    confirm: "",
    agree: true,
  });
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    if (!form.displayName.trim()) return "Vui lòng nhập display name.";
    if (!form.email.trim()) return "Vui lòng nhập email.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Email không hợp lệ.";
    if (!form.password) return "Vui lòng nhập mật khẩu.";
    if (form.password.length < 6) return "Mật khẩu tối thiểu 6 ký tự.";
    if (form.password !== form.confirm) return "Mật khẩu nhập lại không khớp.";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

    try {
      setLoading(true);
      // Gửi đúng field theo model/controller: email, password (server sẽ hash thành passwordHash), displayName
      const { data } = await api.post("/auth/register", {
        email: form.email.trim(),
        password: form.password,
        displayName: form.displayName.trim(),
      });

      // Hai kịch bản: backend trả token (auto login) hoặc chỉ message
      if (data?.token) {
        localStorage.setItem("token", data.token);
        toast.success("Đăng ký & đăng nhập thành công!");
        return navigate("/");
      }

      toast.success("Tạo tài khoản thành công, vui lòng đăng nhập.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Đăng ký thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black relative">
      {/* Cosmic Noise Background */}
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
            <Link className="text-white hover:text-purple-200" to="/">
              Home
            </Link>
          </div>
        </div>

        <div className="w-full px-4">
          <form
            onSubmit={onSubmit}
            className="mx-auto w-full max-w-md bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-6"
          >
            <div className="text-center mb-6">
              <h1 className="text-3xl font-extrabold text-purple-700">
                Tạo tài khoản
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                🔥🔥🔥
              </p>
            </div>

            {/* Display Name */}
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">
                Display name
              </span>
              <input
                type="text"
                name="displayName"
                value={form.displayName}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white/80 p-3 outline-none focus:ring-2 focus:ring-purple-300"
                placeholder="Schward Hatties"
                autoComplete="nickname"
              />
            </label>

            {/* Email */}
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white/80 p-3 outline-none focus:ring-2 focus:ring-purple-300"
                placeholder="you@email.com"
                autoComplete="email"
              />
            </label>

            {/* Password */}
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">
                Mật khẩu
              </span>
              <div className="mt-1 relative">
                <input
                  type={showPw ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  className="w-full rounded-xl border border-gray-200 bg-white/80 p-3 pr-12 outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-purple-700 hover:text-purple-900"
                >
                  {showPw ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </label>

            {/* Confirm Password */}
            <label className="block mb-6">
              <span className="text-sm font-medium text-gray-700">
                Nhập lại mật khẩu
              </span>
              <div className="mt-1 relative">
                <input
                  type={showPw2 ? "text" : "password"}
                  name="confirm"
                  value={form.confirm}
                  onChange={onChange}
                  className="w-full rounded-xl border border-gray-200 bg-white/80 p-3 pr-12 outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw2((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-purple-700 hover:text-purple-900"
                >
                  {showPw2 ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-purple-600 text-white font-semibold
                       hover:bg-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-xs text-gray-500">hoặc</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            {/* Secondary */}
            <Link
              to="/login"
              className="block text-center w-full py-3 rounded-xl bg-white text-purple-700 font-medium border border-purple-200 hover:bg-purple-50 transition"
            >
              Đã có tài khoản? Đăng nhập
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
