import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export const register = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });
    }
    const existed = await User.findOne({ email: email.toLowerCase().trim() });
    if (existed) {
      return res.status(409).json({ message: "Email đã được sử dụng" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase().trim(),
      passwordHash: hash,
      displayName: displayName?.trim() || "",
    });

    return res.status(201).json({
      _id: user._id,
      email: user.email,
      displayName: user.displayName,
    });
  } catch (err) {
    console.error("Lỗi register:", err);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: (email || "").toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const ok = await bcrypt.compare(password || "", user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const token = jwt.sign(
      { _id: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (err) {
    console.error("Lỗi login:", err);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const me = async (req, res) => {
  try {
    // req.user được set bởi middleware auth
    return res.status(200).json(req.user);
  } catch (err) {
    console.error("Lỗi me:", err);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
