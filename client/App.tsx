import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as React from "react";
import { Component, ErrorInfo, ReactNode, useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";

import { accessibility } from "./utils/accessibility";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Importer from "./pages/Importer";
import Exporter from "./pages/Exporter";
import Orders from "./pages/Orders";
import Registration from "./pages/Registration";
import Messages from "./pages/Messages";
import ProductDetail from "./pages/ProductDetail";
import DisputeResolution from "./pages/DisputeResolution";
import Webhooks from "./pages/Webhooks";
import Dashboard from "./pages/Dashboard";
import ImporterDashboard from "./pages/ImporterDashboard";
import ExporterDashboard from "./pages/ExporterDashboard";
import NotificationSettings from "./pages/NotificationSettings";
import NotFound from "./pages/NotFound";
import { BugReportButton } from "./components/BugReportWidget";

const queryClient = new QueryClient();

// Simple Error Boundary for HMR compatibility
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Something went wrong
            </h2>
            <p className="text-muted-foreground mb-4">
              {import.meta.env.DEV
                ? this.state.error?.message
                : "An unexpected error occurred"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  useEffect(() => {
    // Initialize accessibility features
    accessibility.init();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="vasa-theme">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <main id="main-content" role="main" tabIndex={-1}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/importer" element={<Importer />} />
                  <Route path="/exporter" element={<Exporter />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/registration" element={<Registration />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/disputes" element={<DisputeResolution />} />
                  <Route path="/webhooks" element={<Webhooks />} />
                  <Route
                    path="/dashboard"
                    element={<Dashboard userRole="importer" />}
                  />
                  <Route
                    path="/importer-dashboard"
                    element={<ImporterDashboard />}
                  />
                  <Route
                    path="/exporter-dashboard"
                    element={<ExporterDashboard />}
                  />
                  <Route
                    path="/notifications"
                    element={<NotificationSettings />}
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              {/* Global Bug Report Widget */}
              <aside aria-label="Bug reporting">
                <BugReportButton className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl" />
              </aside>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

// Improved root management for HMR compatibility
const container = document.getElementById("root")!;

// Check if we're in development mode and handle HMR properly
if (import.meta.hot) {
  // In development with HMR, always create a fresh root
  const root = createRoot(container);
  root.render(<App />);

  // Accept HMR updates
  import.meta.hot.accept();
} else {
  // In production, use the singleton pattern
  let root = (container as any)._reactRoot;
  if (!root) {
    root = createRoot(container);
    (container as any)._reactRoot = root;
  }
  root.render(<App />);
}
