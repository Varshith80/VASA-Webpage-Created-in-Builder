import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Importer from "./pages/Importer";
import Exporter from "./pages/Exporter";
import Orders from "./pages/Orders";
import Registration from "./pages/Registration";
import Messages from "./pages/Messages";
import ProductDetail from "./pages/ProductDetail";
import DisputeResolution from "./pages/DisputeResolution";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

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
