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
      onValueChange={(value) => value && setTheme(value)}
      aria-label="Color theme"
    >
      <ToggleGroupItem value="light" aria-label="Light theme" title="Light">
        <Sun />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Dark theme" title="Dark">
        <Moon />
      </ToggleGroupItem>
      <ToggleGroupItem value="system" aria-label="System theme" title="System">
        <Monitor />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}