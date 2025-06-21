import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ApiProvider } from "./contexts/ApiContext";
import { setupGlobalErrorHandler } from "./utils/errorHandler";

// Conditional Tempo initialization - only in development
try {
  if (import.meta.env.VITE_TEMPO === "true" && import.meta.env.DEV) {
    const { TempoDevtools } = await import("tempo-devtools");
    TempoDevtools.init();
  }
} catch (error) {
  console.log("Tempo devtools not available in production");
}

// Setup global error handling
setupGlobalErrorHandler();

// Ensure root element exists
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const basename = import.meta.env.BASE_URL || "/";

// Production-safe rendering
const renderApp = () => {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ApiProvider>
          <BrowserRouter basename={basename}>
            <App />
          </BrowserRouter>
        </ApiProvider>
      </React.StrictMode>,
    );
  } catch (error) {
    console.error("Failed to render app:", error);
    // Fallback rendering without StrictMode
    ReactDOM.createRoot(rootElement).render(
      <ApiProvider>
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </ApiProvider>,
    );
  }
};

renderApp();
