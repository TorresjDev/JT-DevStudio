"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = React.useCallback(() => {
    const next = resolvedTheme === "dark" ? "light" : "dark"
    const root = document.documentElement

    // next-themes applies the class in a passive effect, too late for a
    // view-transition snapshot — flip it synchronously here (its own apply
    // is idempotent) and let setTheme sync state + storage.
    const apply = () => {
      root.classList.toggle("dark", next === "dark")
      root.classList.toggle("light", next === "light")
      root.style.colorScheme = next
      setTheme(next)
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (reduceMotion || typeof document.startViewTransition !== "function") {
      // Coordinated CSS fade: html.theme-fade makes every element transition
      // color properties at the same rate (see globals.css).
      root.classList.add("theme-fade")
      apply()
      window.setTimeout(() => root.classList.remove("theme-fade"), 550)
      return
    }

    // html.theme-vt freezes per-element transitions so the new snapshot is
    // captured in its final state; the crossfade itself is the transition.
    root.classList.add("theme-vt")
    document
      .startViewTransition(apply)
      .finished.finally(() => root.classList.remove("theme-vt"))
  }, [resolvedTheme, setTheme])

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative h-9 w-9 rounded-full border border-border bg-background/50 backdrop-blur-sm transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-accent hover:text-accent-foreground"
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 text-amber-500 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 text-slate-400 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
