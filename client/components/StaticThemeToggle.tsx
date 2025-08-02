import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor } from "lucide-react";

export function StaticThemeToggle() {
  // No React hooks - completely static implementation

  const getCurrentTheme = (): "light" | "dark" | "system" => {
    if (typeof window === "undefined") return "dark";

    const savedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | "system"
      | null;
    return savedTheme || "dark";
  };

  const applyTheme = (theme: "light" | "dark" | "system") => {
    if (typeof window === "undefined") return;

    const htmlElement = document.documentElement;

    if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      htmlElement.classList.toggle("dark", prefersDark);
    } else {
      htmlElement.classList.toggle("dark", theme === "dark");
    }

    localStorage.setItem("theme", theme);

    // Force re-render by updating a data attribute
    htmlElement.setAttribute("data-theme", theme);
  };

  const cycleTheme = () => {
    const currentTheme = getCurrentTheme();
    const nextTheme =
      currentTheme === "light"
        ? "dark"
        : currentTheme === "dark"
          ? "system"
          : "light";

    applyTheme(nextTheme);

    // Update button content manually
    updateButtonContent(nextTheme);
  };

  const updateButtonContent = (theme: "light" | "dark" | "system") => {
    // Find the button and update its content
    const button = document.querySelector("[data-theme-toggle]");
    if (button) {
      const iconElement = button.querySelector("[data-theme-icon]");
      const textElement = button.querySelector("[data-theme-text]");

      if (iconElement && textElement) {
        // Update icon
        if (theme === "light") {
          iconElement.innerHTML =
            '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>';
          textElement.textContent = "Light";
        } else if (theme === "dark") {
          iconElement.innerHTML =
            '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>';
          textElement.textContent = "Dark";
        } else {
          iconElement.innerHTML =
            '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>';
          textElement.textContent = "System";
        }
      }
    }
  };

  // Initialize theme on component mount (but without useEffect)
  if (typeof window !== "undefined") {
    // Apply initial theme
    const savedTheme = getCurrentTheme();
    applyTheme(savedTheme);
  }

  const currentTheme =
    typeof window !== "undefined" ? getCurrentTheme() : "dark";

  const getIcon = () => {
    switch (currentTheme) {
      case "light":
        return <Sun className="h-4 w-4" data-theme-icon />;
      case "dark":
        return <Moon className="h-4 w-4" data-theme-icon />;
      case "system":
        return <Monitor className="h-4 w-4" data-theme-icon />;
    }
  };

  const getLabel = () => {
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
      aria-label={`Current theme: ${getLabel()}. Click to change theme.`}
      data-theme-toggle
    >
      {getIcon()}
      <span className="hidden sm:inline text-sm" data-theme-text>
        {getLabel()}
      </span>
    </Button>
  );
}
