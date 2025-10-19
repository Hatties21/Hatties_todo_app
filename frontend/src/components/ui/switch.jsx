import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

function Switch({ className, ...props }) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // nền gốc: đổi light/dark ngược nhau
        "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none",
        // ⬇️ đảo lại so với gốc: light → dùng màu từng thuộc dark
        "data-[state=checked]:bg-input data-[state=unchecked]:bg-primary",
        "dark:data-[state=checked]:bg-input/80 dark:data-[state=unchecked]:bg-primary",
        // focus
        "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring",
        // disable
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-4 rounded-full ring-0 transition-transform",
          // gốc: bg-background → giờ đảo lại
          "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
          // đảo lại phần dark/light thumb
          "bg-foreground dark:data-[state=checked]:bg-foreground dark:data-[state=unchecked]:bg-primary-foreground"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
