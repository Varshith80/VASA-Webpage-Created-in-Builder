// Accessibility utilities for the VASA platform

/**
 * Screen reader announcements
 */
export const announceToScreenReader = (
  message: string,
  priority: "polite" | "assertive" = "polite",
) => {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Focus management utilities
 */
export const focusManager = {
  /**
   * Set focus to element with optional delay
   */
  setFocus: (element: HTMLElement | null, delay = 0) => {
    if (!element) return;

    if (delay > 0) {
      setTimeout(() => element.focus(), delay);
    } else {
      element.focus();
    }
  },

  /**
   * Get all focusable elements within a container
   */
  getFocusableElements: (container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(", ");

    return Array.from(container.querySelectorAll(focusableSelectors));
  },

  /**
   * Trap focus within a container (useful for modals)
   */
  trapFocus: (container: HTMLElement) => {
    const focusableElements = focusManager.getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener("keydown", handleTabKey);

    // Focus first element
    firstElement?.focus();

    return () => {
      container.removeEventListener("keydown", handleTabKey);
    };
  },
};

/**
 * Keyboard navigation utilities
 */
export const keyboardNavigation = {
  /**
   * Handle arrow key navigation in lists
   */
  handleArrowKeys: (
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onIndexChange: (index: number) => void,
    orientation: "horizontal" | "vertical" = "vertical",
  ) => {
    const { key } = event;
    let newIndex = currentIndex;

    if (orientation === "vertical") {
      if (key === "ArrowDown") {
        newIndex = (currentIndex + 1) % items.length;
      } else if (key === "ArrowUp") {
        newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
      }
    } else {
      if (key === "ArrowRight") {
        newIndex = (currentIndex + 1) % items.length;
      } else if (key === "ArrowLeft") {
        newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
      }
    }

    if (newIndex !== currentIndex) {
      event.preventDefault();
      onIndexChange(newIndex);
      items[newIndex]?.focus();
    }
  },

  /**
   * Handle common keyboard shortcuts
   */
  handleCommonShortcuts: (
    event: KeyboardEvent,
    actions: Record<string, () => void>,
  ) => {
    const { key, ctrlKey, metaKey, shiftKey } = event;
    const modifierKey = ctrlKey || metaKey;

    // Create shortcut key
    const shortcut = [
      modifierKey && "ctrl",
      shiftKey && "shift",
      key.toLowerCase(),
    ]
      .filter(Boolean)
      .join("+");

    if (actions[shortcut]) {
      event.preventDefault();
      actions[shortcut]();
    }
  },
};

/**
 * Color contrast utilities
 */
export const colorContrast = {
  /**
   * Calculate relative luminance
   */
  getLuminance: (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  /**
   * Calculate contrast ratio between two colors
   */
  getContrastRatio: (color1: string, color2: string): number => {
    // This is a simplified version - in production you'd want a more robust color parser
    const rgb1 = colorContrast.hexToRgb(color1);
    const rgb2 = colorContrast.hexToRgb(color2);

    if (!rgb1 || !rgb2) return 1;

    const lum1 = colorContrast.getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = colorContrast.getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  },

  /**
   * Convert hex to RGB
   */
  hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  },

  /**
   * Check if contrast ratio meets WCAG guidelines
   */
  meetsWCAG: (ratio: number, level: "AA" | "AAA" = "AA"): boolean => {
    return level === "AA" ? ratio >= 4.5 : ratio >= 7;
  },
};

/**
 * Motion and animation preferences
 */
export const motionPreferences = {
  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion: (): boolean => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  },

  /**
   * Apply animation conditionally based on user preference
   */
  conditionalAnimation: (animation: string): string => {
    return motionPreferences.prefersReducedMotion() ? "" : animation;
  },
};

/**
 * Text and reading utilities
 */
export const readingUtilities = {
  /**
   * Estimate reading time for text content
   */
  estimateReadingTime: (text: string, wordsPerMinute = 200): number => {
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  },

  /**
   * Check text readability (simplified Flesch reading ease)
   */
  getReadabilityScore: (text: string): number => {
    const sentences = text.split(/[.!?]+/).length - 1;
    const words = text.trim().split(/\s+/).length;
    const syllables = readingUtilities.countSyllables(text);

    if (sentences === 0 || words === 0) return 0;

    const avgSentenceLength = words / sentences;
    const avgSyllablesPerWord = syllables / words;

    return 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord;
  },

  /**
   * Simple syllable counter
   */
  countSyllables: (text: string): number => {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    return words.reduce((total, word) => {
      // Simple syllable counting - count vowel groups
      const syllableMatches = word.match(/[aeiouy]+/g);
      let syllables = syllableMatches ? syllableMatches.length : 1;

      // Adjust for silent 'e'
      if (word.endsWith("e")) syllables -= 1;

      return total + Math.max(1, syllables);
    }, 0);
  },
};

/**
 * Form accessibility helpers
 */
export const formAccessibility = {
  /**
   * Generate accessible form field IDs and labels
   */
  generateFieldId: (
    baseId: string,
  ): {
    fieldId: string;
    labelId: string;
    errorId: string;
    helpId: string;
  } => ({
    fieldId: baseId,
    labelId: `${baseId}-label`,
    errorId: `${baseId}-error`,
    helpId: `${baseId}-help`,
  }),

  /**
   * Create ARIA attributes for form fields
   */
  createAriaAttributes: (
    fieldId: string,
    hasError: boolean,
    hasHelp: boolean,
    required = false,
  ): Record<string, string> => {
    const attributes: Record<string, string> = {};

    if (required) {
      attributes["aria-required"] = "true";
    }

    if (hasError) {
      attributes["aria-invalid"] = "true";
      attributes["aria-describedby"] = `${fieldId}-error`;
    }

    if (hasHelp && !hasError) {
      attributes["aria-describedby"] = `${fieldId}-help`;
    }

    if (hasHelp && hasError) {
      attributes["aria-describedby"] = `${fieldId}-help ${fieldId}-error`;
    }

    return attributes;
  },
};

/**
 * Accessibility testing utilities (for development)
 */
export const a11yTesting = {
  /**
   * Check for common accessibility issues
   */
  runBasicChecks: (): string[] => {
    const issues: string[] = [];

    // Check for images without alt text
    const imagesWithoutAlt = document.querySelectorAll("img:not([alt])");
    if (imagesWithoutAlt.length > 0) {
      issues.push(`Found ${imagesWithoutAlt.length} images without alt text`);
    }

    // Check for empty buttons
    const emptyButtons = document.querySelectorAll("button:empty");
    if (emptyButtons.length > 0) {
      issues.push(`Found ${emptyButtons.length} empty buttons`);
    }

    // Check for missing form labels
    const inputsWithoutLabels = document.querySelectorAll(
      "input:not([aria-label]):not([aria-labelledby])",
    );
    const unlabeledInputs = Array.from(inputsWithoutLabels).filter((input) => {
      const id = input.getAttribute("id");
      return id ? !document.querySelector(`label[for="${id}"]`) : true;
    });

    if (unlabeledInputs.length > 0) {
      issues.push(`Found ${unlabeledInputs.length} form inputs without labels`);
    }

    // Check for low contrast (simplified)
    const contrastIssues = a11yTesting.checkBasicContrast();
    if (contrastIssues.length > 0) {
      issues.push(...contrastIssues);
    }

    return issues;
  },

  /**
   * Basic contrast checking (simplified)
   */
  checkBasicContrast: (): string[] => {
    const issues: string[] = [];

    // Check common text elements
    const textElements = document.querySelectorAll(
      "p, h1, h2, h3, h4, h5, h6, span, div, button, a",
    );
    let lowContrastCount = 0;

    textElements.forEach((element) => {
      const computedStyle = window.getComputedStyle(element);
      const textColor = computedStyle.color;
      const backgroundColor = computedStyle.backgroundColor;

      // Skip if transparent background
      if (
        backgroundColor === "rgba(0, 0, 0, 0)" ||
        backgroundColor === "transparent"
      ) {
        return;
      }

      // Simple check - in production you'd want more sophisticated color parsing
      if (textColor && backgroundColor) {
        const textLuminance = colorContrast.getLuminance(128, 128, 128); // Simplified
        const bgLuminance = colorContrast.getLuminance(255, 255, 255); // Simplified
        const ratio =
          (Math.max(textLuminance, bgLuminance) + 0.05) /
          (Math.min(textLuminance, bgLuminance) + 0.05);

        if (ratio < 4.5) {
          lowContrastCount++;
        }
      }
    });

    if (lowContrastCount > 0) {
      issues.push(
        `Found ${lowContrastCount} elements with potentially low contrast`,
      );
    }

    return issues;
  },
};

/**
 * High contrast mode utilities
 */
export const highContrastMode = {
  /**
   * Check if high contrast mode is active
   */
  isActive: (): boolean => {
    return window.matchMedia("(prefers-contrast: high)").matches;
  },

  /**
   * Apply high contrast styles
   */
  applyHighContrastStyles: () => {
    if (highContrastMode.isActive()) {
      document.documentElement.classList.add("high-contrast");
    }
  },
};

// Export default accessibility manager
export const accessibility = {
  announceToScreenReader,
  focusManager,
  keyboardNavigation,
  colorContrast,
  motionPreferences,
  readingUtilities,
  formAccessibility,
  a11yTesting,
  highContrastMode,

  /**
   * Initialize accessibility features
   */
  init: () => {
    // Apply high contrast styles if needed
    highContrastMode.applyHighContrastStyles();

    // Add skip to main content link
    const skipLink = document.createElement("a");
    skipLink.href = "#main-content";
    skipLink.textContent = "Skip to main content";
    skipLink.className =
      "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded focus:z-50";
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Run basic accessibility checks in development
    if (process.env.NODE_ENV === "development") {
      setTimeout(() => {
        const issues = a11yTesting.runBasicChecks();
        if (issues.length > 0) {
          console.warn("Accessibility issues found:", issues);
        }
      }, 2000);
    }
  },
};
