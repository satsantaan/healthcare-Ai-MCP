import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "../home";

// Mock the child components
vi.mock("../EMRWorkspace", () => ({
  default: () => <div data-testid="emr-workspace">EMR Workspace</div>,
}));

vi.mock("../MCPStatusDashboard", () => ({
  default: () => (
    <div data-testid="mcp-status-dashboard">MCP Status Dashboard</div>
  ),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Home Component", () => {
  it("renders the main dashboard", () => {
    renderWithRouter(<Home />);

    expect(screen.getByText("EMR AI Enhancement System")).toBeInTheDocument();
    expect(screen.getByText("Dr. Sarah Johnson")).toBeInTheDocument();
  });

  it("displays AI modules in the sidebar", () => {
    renderWithRouter(<Home />);

    expect(screen.getByText("Clinical Documentation")).toBeInTheDocument();
    expect(screen.getByText("Billing & Coding")).toBeInTheDocument();
    expect(screen.getByText("Summary Generation")).toBeInTheDocument();
    expect(screen.getByText("Medical Imaging")).toBeInTheDocument();
  });

  it("shows connected EMR systems", () => {
    renderWithRouter(<Home />);

    expect(screen.getByText("MedFlow EMR")).toBeInTheDocument();
    expect(screen.getByText("HealthTech Pro")).toBeInTheDocument();
    expect(screen.getByText("ClinicalSoft")).toBeInTheDocument();
  });

  it("allows tab navigation", async () => {
    renderWithRouter(<Home />);

    // Click on MCP Status tab
    const mcpStatusTab = screen.getByText("MCP Status");
    fireEvent.click(mcpStatusTab);

    await waitFor(() => {
      expect(screen.getByTestId("mcp-status-dashboard")).toBeInTheDocument();
    });
  });

  it("toggles AI assistant", async () => {
    renderWithRouter(<Home />);

    const aiToggle = screen.getByLabelText("AI Assistant");
    expect(aiToggle).toBeChecked();

    fireEvent.click(aiToggle);
    expect(aiToggle).not.toBeChecked();
  });

  it("opens API key management modal", async () => {
    renderWithRouter(<Home />);

    const manageApiKeysButton = screen.getByText("Manage API Keys");
    fireEvent.click(manageApiKeysButton);

    await waitFor(() => {
      expect(screen.getByText("API Key Management")).toBeInTheDocument();
    });
  });

  it("displays system status", () => {
    renderWithRouter(<Home />);

    // Should show either "AI Connected" or "AI Degraded"
    const statusElement = screen.getByText(/AI (Connected|Degraded)/);
    expect(statusElement).toBeInTheDocument();
  });

  it("shows HIPAA compliance badge", () => {
    renderWithRouter(<Home />);

    expect(screen.getByText("HIPAA")).toBeInTheDocument();
  });

  it("handles EMR system selection", async () => {
    renderWithRouter(<Home />);

    const medflowButton = screen.getByText("MedFlow EMR");
    fireEvent.click(medflowButton);

    await waitFor(() => {
      expect(screen.getByTestId("emr-workspace")).toBeInTheDocument();
    });
  });
});
