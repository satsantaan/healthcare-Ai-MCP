import React, { Suspense } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import Home from "./components/home";
import { Toaster } from "@/components/ui/toaster";
import { ApiProvider } from "@/contexts/ApiContext";

// Conditional import for tempo routes
let routes: any = [];
try {
  if (import.meta.env.VITE_TEMPO === "true") {
    const tempoRoutes = await import("tempo-routes");
    routes = tempoRoutes.default || [];
  }
} catch (error) {
  console.log("Tempo routes not available in production");
  routes = [];
}

// Error Boundary Component
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-red-600">
              Application Error
            </h1>
            <p className="text-muted-foreground">
              Something went wrong. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <AppErrorBoundary>
      <ApiProvider>
        <div className="min-h-screen bg-background">
          <Suspense fallback={<LoadingSpinner />}>
            {/* Tempo routes for storyboards - only in development */}
            {import.meta.env.VITE_TEMPO === "true" &&
              routes.length > 0 &&
              useRoutes(routes)}

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>

          <Toaster />
        </div>
      </ApiProvider>
    </AppErrorBoundary>
  );
}

export default App;
