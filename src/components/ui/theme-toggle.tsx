"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="h-9 w-9 rounded-full border border-border bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground transition-all duration-300"
      aria-label="Toggle theme"
    >{theme === "light" ? (
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-amber-500" />
    ) : (
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-400" />
    )}
    </Button>
  )
}
