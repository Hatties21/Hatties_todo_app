import React, { useState } from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar, CheckCircle2, Circle, SquarePen, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import api from "@/lib/axios";
import { toast } from "sonner";

const TaskCard = ({ task, index, handleTaskChanged }) => {
  const [isEditting, setIsEditting] = useState(false);
  const [updateTaskTitle, setUpdateTaskTitle] = useState(task.title || "");

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success("Nhiệm vụ đã xoá.");
      handleTaskChanged();
    } catch (error) {
      console.error("Lỗi xảy ra khi xoá task.", error);
      toast.error("Lỗi xảy ra khi xoá nhiệm vụ.");
    }
  };

  const updateTask = async () => {
    try {
      setIsEditting(false);
      await api.put(`/tasks/${task._id}`, { title: updateTaskTitle });
      toast.success(`Nhiệm vụ đã đổi thành "${updateTaskTitle}"`);
      handleTaskChanged();
    } catch (error) {
      console.error("Lỗi khi update task.", error);
      toast.error("Lỗi khi cập nhật nhiệm vụ.");
    }
  };

  const toggleTaskCompleteButton = async () => {
    try {
      const isActive = task.status === "active";
      await api.put(`/tasks/${task._id}`, {
        status: isActive ? "complete" : "active",
        completedAt: isActive ? new Date().toISOString() : null,
      });
      toast.success(
        isActive ? `${task.title} đã hoàn thành.` : `${task.title} đã đổi sang chưa hoàn thành.`
      );
      handleTaskChanged();
    } catch (error) {
      console.error("Lỗi khi update task.", error);
      toast.error("Lỗi khi cập nhật nhiệm vụ.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") updateTask();
    if (e.key === "Escape") {
      setIsEditting(false);
      setUpdateTaskTitle(task.title || "");
    }
  };

  return (
    <Card
      className={cn(
        // dùng token để auto light/dark
        "px-4 py-3 rounded-2xl bg-card text-card-foreground border border-border",
        "shadow-custom-md hover:shadow-custom-lg transition-smooth animate-fade-in group",
        task.status === "complete" && "opacity-80"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-3">
        {/* nút trạng thái */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "mt-1 size-8 rounded-full border border-input",
            "hover:bg-accent hover:text-accent-foreground transition-smooth",
            task.status === "complete" ? "text-success" : "text-muted-foreground"
          )}
          onClick={toggleTaskCompleteButton}
          aria-label={task.status === "complete" ? "Hoàn tác hoàn thành" : "Đánh dấu hoàn thành"}
        >
          {task.status === "complete" ? (
            <CheckCircle2 className="size-5" />
          ) : (
            <Circle className="size-5" />
          )}
        </Button>

        {/* tiêu đề + ngày */}
        <div className="flex-1 min-w-0">
          {isEditting ? (
            <Input
              autoFocus
              placeholder="Cần phải làm gì?"
              className="
                h-10 text-base w-full
                bg-background text-foreground
                placeholder:text-muted-foreground
                border border-input
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring/50
                transition-smooth
              "
              type="text"
              value={updateTaskTitle}
              onChange={(e) => setUpdateTaskTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={() => {
                setIsEditting(false);
                setUpdateTaskTitle(task.title || "");
              }}
            />
          ) : (
            <p
              className={cn(
                "text-base leading-6 transition-smooth",
                task.status === "complete"
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              )}
            >
              {task.title}
            </p>
          )}

          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            <span>{new Date(task.createdAt).toLocaleString()}</span>
            {task.completedAt && (
              <>
                <span>•</span>
                <Calendar className="size-4" />
                <span>{new Date(task.completedAt).toLocaleString()}</span>
              </>
            )}
          </div>
        </div>

        {/* hành động (không làm lệch layout khi hover) */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-info transition-smooth"
            onClick={() => {
              setIsEditting(true);
              setUpdateTaskTitle(task.title || "");
            }}
            aria-label="Chỉnh sửa"
            title="Chỉnh sửa"
          >
            <SquarePen className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive transition-smooth"
            onClick={() => deleteTask(task._id)}
            aria-label="Xoá"
            title="Xoá"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
