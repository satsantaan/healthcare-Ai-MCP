// API Context for global state management

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { ApiError } from "../services/api";

// Global API state
interface ApiState {
  isOnline: boolean;
  globalLoading: boolean;
  globalError: ApiError | null;
  requestCount: number;
  lastActivity: Date | null;
}

// API actions
type ApiAction =
  | { type: "SET_ONLINE"; payload: boolean }
  | { type: "SET_GLOBAL_LOADING"; payload: boolean }
  | { type: "SET_GLOBAL_ERROR"; payload: ApiError | null }
  | { type: "INCREMENT_REQUEST_COUNT" }
  | { type: "UPDATE_LAST_ACTIVITY" }
  | { type: "RESET_STATE" };

// Initial state
const initialState: ApiState = {
  isOnline: navigator.onLine,
  globalLoading: false,
  globalError: null,
  requestCount: 0,
  lastActivity: null,
};

// Reducer
function apiReducer(state: ApiState, action: ApiAction): ApiState {
  switch (action.type) {
    case "SET_ONLINE":
      return { ...state, isOnline: action.payload };
    case "SET_GLOBAL_LOADING":
      return { ...state, globalLoading: action.payload };
    case "SET_GLOBAL_ERROR":
      return { ...state, globalError: action.payload };
    case "INCREMENT_REQUEST_COUNT":
      return {
        ...state,
        requestCount: state.requestCount + 1,
        lastActivity: new Date(),
      };
    case "UPDATE_LAST_ACTIVITY":
      return { ...state, lastActivity: new Date() };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
}

// Context
interface ApiContextType {
  state: ApiState;
  dispatch: React.Dispatch<ApiAction>;
  setOnline: (online: boolean) => void;
  setGlobalLoading: (loading: boolean) => void;
  setGlobalError: (error: ApiError | null) => void;
  incrementRequestCount: () => void;
  updateLastActivity: () => void;
  resetState: () => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

// Provider component
interface ApiProviderProps {
  children: ReactNode;
}

export function ApiProvider({ children }: ApiProviderProps) {
  const [state, dispatch] = useReducer(apiReducer, initialState);

  // Action creators
  const setOnline = (online: boolean) => {
    dispatch({ type: "SET_ONLINE", payload: online });
  };

  const setGlobalLoading = (loading: boolean) => {
    dispatch({ type: "SET_GLOBAL_LOADING", payload: loading });
  };

  const setGlobalError = (error: ApiError | null) => {
    dispatch({ type: "SET_GLOBAL_ERROR", payload: error });
  };

  const incrementRequestCount = () => {
    dispatch({ type: "INCREMENT_REQUEST_COUNT" });
  };

  const updateLastActivity = () => {
    dispatch({ type: "UPDATE_LAST_ACTIVITY" });
  };

  const resetState = () => {
    dispatch({ type: "RESET_STATE" });
  };

  // Listen for online/offline events
  React.useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const value: ApiContextType = {
    state,
    dispatch,
    setOnline,
    setGlobalLoading,
    setGlobalError,
    incrementRequestCount,
    updateLastActivity,
    resetState,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

// Hook to use the API context
export function useApiContext() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApiContext must be used within an ApiProvider");
  }
  return context;
}

// Hook for API status
export function useApiStatus() {
  const { state } = useApiContext();
  return {
    isOnline: state.isOnline,
    isLoading: state.globalLoading,
    error: state.globalError,
    requestCount: state.requestCount,
    lastActivity: state.lastActivity,
  };
}
