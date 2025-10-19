import React, { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

const AddTask = ({ handleNewTaskAdded }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const addTask = async () => {
    if (newTaskTitle.trim()) {
      try {
        await api.post("/tasks", { title: newTaskTitle });
        toast.success(`Nhiệm vụ "${newTaskTitle}" đã được thêm vào.`);
        handleNewTaskAdded();
        setNewTaskTitle("");
      } catch (error) {
        console.error("Lỗi xảy ra khi thêm task.", error);
        toast.error("Lỗi xảy ra khi thêm nhiệm vụ mới.");
      }
    } else {
      toast.error("Bạn cần nhập nội dung của nhiệm vụ.");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") addTask();
  };

  return (
    <Card
      className="
        p-6 rounded-2xl border border-border bg-card text-card-foreground 
        shadow-custom-md transition-smooth
      "
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="text"
          placeholder="Cần phải làm gì?"
          className="
            h-12 text-base sm:flex-1
            bg-background text-foreground 
            placeholder:text-muted-foreground 
            border border-input 
            focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring/50
            transition-smooth
          "
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <Button
          onClick={addTask}
          disabled={!newTaskTitle.trim()}
          className="
            h-12 px-6 rounded-lg font-medium
            bg-primary text-primary-foreground 
            hover:bg-primary/90 disabled:opacity-60
            transition-smooth flex items-center justify-center gap-2
          "
        >
          <Plus className="size-5" />
          Thêm
        </Button>
      </div>
    </Card>
  );
};

export default AddTask;
