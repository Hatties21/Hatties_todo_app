import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export const auth = async (req, res, next) => {
  try {
    const hdr = req.headers.authorization || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload._id).select("_id email displayName");
    if (!user) return res.status(401).json({ message: "Tài khoản không tồn tại" });

    req.user = { _id: user._id, email: user.email, displayName: user.displayName };
    next();
  } catch {
    return res.status(401).json({ message: "Phiên đăng nhập không hợp lệ" });
  }
};

export const protect = auth;