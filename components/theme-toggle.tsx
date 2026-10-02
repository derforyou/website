"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <ToggleGroup
      type="single"
      value={theme ?? "system"}
      onValueChange={(value) => {
        if (value) setTheme(value);
      }}
      aria-label="Theme switcher"
      variant="outline"
      size="sm"
    >
      <ToggleGroupItem value="light" aria-label="Light mode">
        <Sun className="size-3.5" />
      </ToggleGroupItem>
      <ToggleGroupItem value="system" aria-label="System mode">
        <Monitor className="size-3.5" />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Dark mode">
        <Moon className="size-3.5" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
