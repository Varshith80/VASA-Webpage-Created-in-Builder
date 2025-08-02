import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor } from "lucide-react";

export function SimpleThemeToggle() {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark" | "system">("dark");

  useEffect(() => {
    // Initialize theme from localStorage or default to dark
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null;
    const theme = storedTheme || "dark";
    setCurrentTheme(theme);
    updateDocumentTheme(theme);
  }, []);

  const updateDocumentTheme = (theme: "light" | "dark" | "system") => {
    const htmlElement = document.documentElement;
    
    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      htmlElement.classList.toggle("dark", prefersDark);
    } else {
      htmlElement.classList.toggle("dark", theme === "dark");
    }
    
    localStorage.setItem("theme", theme);
  };

  const cycleTheme = () => {
    const nextTheme = currentTheme === "light" ? "dark" : 
                     currentTheme === "dark" ? "system" : "light";
    setCurrentTheme(nextTheme);
    updateDocumentTheme(nextTheme);
  };

  const getThemeIcon = () => {
    switch (currentTheme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "system":
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (currentTheme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      className="flex items-center gap-2 hover:bg-muted/50 transition-colors"
      aria-label={`Current theme: ${getThemeLabel()}. Click to change theme.`}
    >
      {getThemeIcon()}
      <span className="hidden sm:inline text-sm">{getThemeLabel()}</span>
    </Button>
  );
}
