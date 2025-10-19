import express from "express";
import Task from "../models/Task.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.use(protect); 

export const getAllTasks = async (req, res) => {
  const { filter = "today" } = req.query;
  const now = new Date();
  let startDate = null;

  switch (filter) {
    case "today": {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    }
    case "week": {
      // Tính thứ 2 của tuần hiện tại (coi CN là 0)
      const mondayDate =
        now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
      startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
      break;
    }
    case "month": {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
    case "all":
    default: {
      startDate = null;
    }
  }

  // ✅ Bắt buộc lọc theo owner
  const match = { owner: req.user._id };
  if (startDate) match.createdAt = { $gte: startDate };

  try {
    const result = await Task.aggregate([
      { $match: match },
      {
        $facet: {
          tasks: [{ $sort: { createdAt: -1 } }],
          activeCount: [
            { $match: { status: "active" } }, // đổi theo enum bạn dùng
            { $count: "count" },
          ],
          completeCount: [
            { $match: { status: "complete" } }, // đổi theo enum bạn dùng
            { $count: "count" },
          ],
        },
      },
    ]);

    const tasks = result[0].tasks;
    const activeCount = result[0].activeCount[0]?.count || 0;
    const completeCount = result[0].completeCount[0]?.count || 0;

    res.status(200).json({ tasks, activeCount, completeCount });
  } catch (error) {
    console.error("Lỗi khi gọi getAllTasks", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

/**
 * POST /api/tasks
 * Body: { title, status?, completedAt? }
 * Tạo task và gán owner = req.user._id
 */
export const createTask = async (req, res) => {
  try {
    const { title, status, completedAt } = req.body;
    if (!title?.trim()) {
      return res.status(400).json({ message: "Vui lòng nhập tiêu đề task" });
    }

    const task = await Task.create({
      title: title.trim(),
      status: status || "active", // đổi default theo schema của bạn
      completedAt: completedAt || null,
      owner: req.user._id, // ✅ GÁN CHỦ SỞ HỮU
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Lỗi khi gọi createTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

/**
 * PUT /api/tasks/:id
 * Chỉ update task thuộc về user hiện tại
 */
export const updateTask = async (req, res) => {
  try {
    const { title, status, completedAt } = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id }, // ✅ RÀNG BUỘC OWNER
      { title, status, completedAt },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Lỗi khi gọi updateTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

/**
 * DELETE /api/tasks/:id
 * Chỉ xóa task thuộc về user hiện tại
 */
export const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id, // ✅ RÀNG BUỘC OWNER
    });

    if (!deleted) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Lỗi khi gọi deleteTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};