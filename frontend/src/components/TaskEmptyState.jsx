import React from "react";
import { Card } from "./ui/card";
import { Circle } from "lucide-react";

const TaskEmptyState = ({ filter }) => {
  const title =
    filter === "active"
      ? "Không có nhiệm vụ nào đang làm."
      : filter === "completed"
      ? "Chưa có nhiệm vụ nào hoàn thành."
      : "Chưa có nhiệm vụ.";

  const subtitle =
    filter === "all"
      ? "Thêm nhiệm vụ đầu tiên vào để bắt đầu!"
      : `Chuyển sang “tất cả” để thấy những nhiệm vụ ${
          filter === "active" ? "đã hoàn thành." : "đang làm."
        }`;

  return (
    <Card
      className="
        p-8 text-center rounded-2xl
        border border-dashed border-border
        bg-card text-card-foreground
        shadow-custom-sm transition-smooth
      "
    >
      <div className="space-y-3">
        <Circle className="mx-auto size-12 text-muted-foreground" />
        <div>
          <h3 className="font-medium text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </Card>
  );
};

export default TaskEmptyState;
