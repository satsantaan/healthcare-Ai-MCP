import React, { useState, useEffect } from "react";
import { handleError } from "@/utils/errorHandler";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Settings,
  Menu,
  ChevronDown,
  Activity,
  Server,
  Brain,
  Search,
  Plus,
  FileText,
  Users,
  Shield,
  Database,
  Cloud,
  BarChart3,
  DollarSign,
  Eye,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  CheckCircle,
  Zap,
  Download,
  Filter,
} from "lucide-react";
import EMRWorkspace from "./EMRWorkspace";
import MCPStatusDashboard from "./MCPStatusDashboard";

const Home = () => {
  const [activeTab, setActiveTab] = useState("workspace");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [selectedModel, setSelectedModel] = useState("local_clinical");
  const [systemStatus, setSystemStatus] = useState("online");

  // Mock user data
  const user = {
    name: "Dr. Sarah Johnson",
    role: "Physician",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    department: "Internal Medicine",
    license: "MD-12345",
  };

  // Mock module data with enhanced information
  const [modules, setModules] = useState([
    {
      id: "clinical",
      name: "Clinical Documentation",
      icon: <Activity className="h-4 w-4" />,
      status: "active",
      description: "AI-powered clinical note generation",
    },
    {
      id: "billing",
      name: "Billing & Coding",
      icon: <Server className="h-4 w-4" />,
      status: "active",
      description: "Automated ICD-10 and CPT coding",
    },
    {
      id: "summary",
      name: "Summary Generation",
      icon: <Brain className="h-4 w-4" />,
      status: "active",
      description: "Patient summary and care plans",
    },
    {
      id: "vision",
      name: "Medical Imaging",
      icon: <FileText className="h-4 w-4" />,
      status: "inactive",
      description: "AI-assisted image analysis",
    },
  ]);

  // Mock connected EMR systems
  const [connectedSystems, setConnectedSystems] = useState([
    {
      id: "1",
      name: "MedFlow EMR",
      version: "v4.2.1",
      status: "active",
      lastSync: "2024-01-15 14:32:15",
      apiCalls: 45200,
    },
    {
      id: "2",
      name: "HealthTech Pro",
      version: "v3.8.0",
      status: "active",
      lastSync: "2024-01-15 14:31:58",
      apiCalls: 38900,
    },
    {
      id: "3",
      name: "ClinicalSoft",
      version: "v5.1.2",
      status: "maintenance",
      lastSync: "2024-01-15 12:15:30",
      apiCalls: 28400,
    },
  ]);

  // System monitoring and health checks
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        // Simulate system status updates
        const statuses = ["online", "degraded"];
        const randomStatus = Math.random() > 0.1 ? "online" : "degraded";
        setSystemStatus(randomStatus);

        // Update connected systems with realistic data
        setConnectedSystems((prev) =>
          prev.map((system) => ({
            ...system,
            apiCalls: system.apiCalls + Math.floor(Math.random() * 100) + 50,
            lastSync: new Date().toLocaleString(),
          })),
        );

        // Log system health for debugging
        console.log("System health check:", {
          status: randomStatus,
          timestamp: new Date().toISOString(),
          connectedSystems: connectedSystems.length,
        });
      } catch (error) {
        console.error("Health check error:", error);
        handleError(error, "System health check failed");
        setSystemStatus("degraded");
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [connectedSystems.length]);

  // Initialize with realistic data
  useEffect(() => {
    // Simulate initial data load with error handling
    const timer = setTimeout(() => {
      try {
        console.log("EMR AI Enhancement System initialized");
        console.log("Environment:", {
          nodeEnv: import.meta.env.MODE,
          baseUrl: import.meta.env.BASE_URL,
          dev: import.meta.env.DEV,
          prod: import.meta.env.PROD,
        });
      } catch (error) {
        console.error("Initialization error:", error);
        handleError(error, "System initialization failed");
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSystemSelect = (system) => {
    setSelectedSystem(system);
    setActiveTab("workspace");
  };

  const handleApiKeyManagement = () => {
    setShowApiKeyModal(true);
  };

  const handleModuleToggle = (moduleId) => {
    console.log(`Toggling module: ${moduleId}`);
    // Update module status
    setModules((prev) =>
      prev.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              status: module.status === "active" ? "inactive" : "active",
            }
          : module,
      ),
    );
  };

  const handleSystemHealthCheck = async () => {
    try {
      console.log("Running system health check...");
      // Simulate health check
      const healthResults = {
        database: Math.random() > 0.1,
        api: Math.random() > 0.05,
        models: Math.random() > 0.15,
        security: Math.random() > 0.02,
        container: true, // Add container health check
        runtime: {
          memory: (performance as any).memory
            ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
            : "unknown",
          timestamp: Date.now(),
        },
      };

      const overallHealth = Object.values(healthResults)
        .filter((v) => typeof v === "boolean")
        .every(Boolean);
      setSystemStatus(overallHealth ? "online" : "degraded");

      console.log("Health check results:", healthResults);
      return healthResults;
    } catch (error) {
      console.error("Health check failed:", error);
      handleError(error, "System health check failed");
      setSystemStatus("degraded");
      return { error: true, message: error.message };
    }
  };

  // Add error boundary wrapper
  const [hasError, setHasError] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);

  useEffect(() => {
    const handleUnhandledError = (event) => {
      console.error("Unhandled error:", event.error);
      setHasError(true);
      setErrorInfo(event.error?.message || "Unknown error occurred");
      handleError(event.error, "Unhandled application error");
    };

    const handleUnhandledRejection = (event) => {
      console.error("Unhandled promise rejection:", event.reason);
      setHasError(true);
      setErrorInfo(event.reason?.message || "Promise rejection occurred");
      handleError(event.reason, "Unhandled promise rejection");
    };

    window.addEventListener("error", handleUnhandledError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleUnhandledError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  if (hasError) {
    return (
      <div className="flex h-screen w-full flex-col bg-background items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Application Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {errorInfo ||
                "An unexpected error occurred. This might be related to container runtime issues."}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setHasError(false);
                  setErrorInfo(null);
                  window.location.reload();
                }}
                size="sm"
              >
                Reload Application
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setHasError(false);
                  setErrorInfo(null);
                }}
                size="sm"
              >
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      {/* Header */}
      <header className="flex h-14 items-center border-b px-4 lg:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6" />
          <h1 className="text-lg font-semibold">EMR AI Enhancement System</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.role}</div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "flex" : "hidden"} w-80 flex-col border-r bg-muted/40 md:flex`}
        >
          {/* AI Modules Section */}
          <div className="flex flex-col gap-2 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">AI Modules</h2>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                MCP
              </Badge>
            </div>
            <div className="space-y-2">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="flex items-center justify-between p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1 rounded bg-primary/10">
                      {module.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{module.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {module.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        module.status === "active" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {module.status}
                    </Badge>
                    <Switch
                      checked={module.status === "active"}
                      onCheckedChange={() => handleModuleToggle(module.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* API Key Management */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">API Configuration</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleApiKeyManagement}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleApiKeyManagement}
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage API Keys
            </Button>
          </div>

          <Separator />

          {/* Connected EMR Systems */}
          <div className="flex-1 overflow-auto p-4">
            <h3 className="mb-3 text-sm font-medium flex items-center gap-2">
              <Server className="h-4 w-4" />
              Connected EMR Systems
            </h3>
            <div className="space-y-2">
              {connectedSystems.map((system) => (
                <Button
                  key={system.id}
                  variant="ghost"
                  className="w-full justify-start p-3 h-auto"
                  onClick={() => handleSystemSelect(system)}
                >
                  <div className="flex flex-col items-start w-full">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium text-sm">{system.name}</span>
                      <Badge
                        variant={
                          system.status === "active" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {system.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {system.version} • {system.apiCalls.toLocaleString()}{" "}
                      calls
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last sync: {system.lastSync}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* System Status Footer */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    systemStatus === "online" ? "bg-green-500" : "bg-amber-500"
                  }`}
                />
                <span className="text-muted-foreground">
                  System {systemStatus}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                HIPAA
              </Badge>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-background p-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full"
          >
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger
                  value="workspace"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  EMR Workspace
                </TabsTrigger>
                <TabsTrigger value="status" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  MCP Status
                </TabsTrigger>
                <TabsTrigger value="models" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Model Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="functions"
                  className="flex items-center gap-2"
                >
                  <Server className="h-4 w-4" />
                  MCP Functions
                </TabsTrigger>
                <TabsTrigger value="audit" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Audit & Billing
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  System Settings
                </TabsTrigger>
                <TabsTrigger value="demo" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Demo Center
                </TabsTrigger>
                <TabsTrigger value="budget" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Token Budget
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="ai-toggle" className="text-sm font-medium">
                    AI Assistant
                  </Label>
                  <Switch
                    id="ai-toggle"
                    checked={aiEnabled}
                    onCheckedChange={setAiEnabled}
                  />
                </div>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local_clinical">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Local Clinical
                      </div>
                    </SelectItem>
                    <SelectItem value="cloud_gpt4">
                      <div className="flex items-center gap-2">
                        <Cloud className="h-4 w-4" />
                        Cloud GPT-4
                      </div>
                    </SelectItem>
                    <SelectItem value="med_llama">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Med-Llama 7B
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Badge
                  variant="outline"
                  className={`${
                    systemStatus === "online"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  <div
                    className={`h-2 w-2 rounded-full mr-2 ${
                      systemStatus === "online"
                        ? "bg-green-500"
                        : "bg-amber-500"
                    }`}
                  />
                  {systemStatus === "online" ? "AI Connected" : "AI Degraded"}
                </Badge>
              </div>
            </div>

            <TabsContent value="workspace" className="h-[calc(100%-40px)] mt-4">
              <div className="h-full">
                {selectedSystem ? (
                  <EMRWorkspace
                    systemData={{
                      id: selectedSystem.id,
                      name: selectedSystem.name,
                      version: selectedSystem.version,
                      status: selectedSystem.status,
                      lastSync: selectedSystem.lastSync,
                      apiCalls: selectedSystem.apiCalls,
                      isDemo: true,
                    }}
                    aiEnabled={aiEnabled}
                  />
                ) : (
                  <Card className="h-full">
                    <CardContent className="flex items-center justify-center h-full">
                      <div className="text-center space-y-4">
                        <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                          <Server className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            Select an EMR System
                          </h3>
                          <p className="text-muted-foreground">
                            Choose a connected EMR system to monitor MCP
                            integration
                          </p>
                        </div>
                        <Button
                          onClick={() =>
                            handleSystemSelect(connectedSystems[0])
                          }
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Connect New EMR System
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="status" className="h-[calc(100%-40px)] mt-4">
              <div className="h-full space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      MCP Architecture Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MCPStatusDashboard />
                  </CardContent>
                </Card>

                {/* Additional System Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Active Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">24</div>
                      <p className="text-xs text-muted-foreground">
                        +12% from yesterday
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">
                        AI Requests/Hour
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,247</div>
                      <p className="text-xs text-muted-foreground">
                        Average response: 85ms
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">System Uptime</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">99.9%</div>
                      <p className="text-xs text-muted-foreground">
                        Last 30 days
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="models" className="h-[calc(100%-40px)] mt-4">
              <div className="space-y-6">
                {/* Model Performance Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Local Models
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8</div>
                      <p className="text-xs text-muted-foreground">
                        6 active, 2 idle
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Cloud className="h-4 w-4" />
                        Cloud Models
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-xs text-muted-foreground">
                        10 active, 2 standby
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Avg Response Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">127ms</div>
                      <p className="text-xs text-green-600">
                        -15% from last week
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Total Requests
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">24.7K</div>
                      <p className="text-xs text-muted-foreground">Today</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Model Performance Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Model Performance Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          name: "Clinical Documentation Model",
                          type: "local",
                          status: "active",
                          requests: 8420,
                          avgTime: 85,
                          accuracy: 94.2,
                          cost: 0,
                        },
                        {
                          name: "GPT-4 Medical",
                          type: "cloud",
                          status: "active",
                          requests: 5630,
                          avgTime: 220,
                          accuracy: 96.8,
                          cost: 142.5,
                        },
                        {
                          name: "Local Coding Assistant",
                          type: "local",
                          status: "active",
                          requests: 3240,
                          avgTime: 65,
                          accuracy: 91.5,
                          cost: 0,
                        },
                        {
                          name: "Claude-3 Sonnet",
                          type: "cloud",
                          status: "active",
                          requests: 2180,
                          avgTime: 180,
                          accuracy: 95.1,
                          cost: 87.2,
                        },
                        {
                          name: "Med-Llama 70B",
                          type: "local",
                          status: "idle",
                          requests: 890,
                          avgTime: 340,
                          accuracy: 89.3,
                          cost: 0,
                        },
                        {
                          name: "Gemini Pro Medical",
                          type: "cloud",
                          status: "standby",
                          requests: 450,
                          avgTime: 160,
                          accuracy: 93.7,
                          cost: 23.4,
                        },
                      ].map((model, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {model.type === "local" ? (
                              <Database className="h-5 w-5 text-blue-600" />
                            ) : (
                              <Cloud className="h-5 w-5 text-purple-600" />
                            )}
                            <div>
                              <div className="font-medium">{model.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {model.type === "local"
                                  ? "Local Deployment"
                                  : "Cloud API"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="text-sm font-medium">
                                {model.requests.toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Requests
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium">
                                {model.avgTime}ms
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Avg Time
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium">
                                {model.accuracy}%
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Accuracy
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium">
                                ${model.cost}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Cost Today
                              </div>
                            </div>
                            <Badge
                              variant={
                                model.status === "active"
                                  ? "default"
                                  : model.status === "idle"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {model.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="functions" className="h-[calc(100%-40px)] mt-4">
              <div className="space-y-6">
                {/* MCP Function Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Server className="h-4 w-4" />
                        Active Functions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">24</div>
                      <p className="text-xs text-muted-foreground">
                        Across 6 servers
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Function Calls
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">156K</div>
                      <p className="text-xs text-muted-foreground">
                        Last 24 hours
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Avg Execution Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">89ms</div>
                      <p className="text-xs text-green-600">-8% improvement</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Error Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">0.12%</div>
                      <p className="text-xs text-muted-foreground">
                        Within SLA
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* MCP Function Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5" />
                      MCP Function Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          name: "generate_clinical_note",
                          server: "Clinical Documentation",
                          calls: 45200,
                          avgTime: 120,
                          successRate: 99.8,
                          revenue: 2260,
                        },
                        {
                          name: "extract_icd_codes",
                          server: "Billing & Coding",
                          calls: 38900,
                          avgTime: 65,
                          successRate: 99.5,
                          revenue: 1945,
                        },
                        {
                          name: "summarize_patient_history",
                          server: "Summary Generation",
                          calls: 28400,
                          avgTime: 95,
                          successRate: 99.2,
                          revenue: 1420,
                        },
                        {
                          name: "analyze_lab_results",
                          server: "Clinical Analysis",
                          calls: 19600,
                          avgTime: 180,
                          successRate: 98.9,
                          revenue: 980,
                        },
                        {
                          name: "generate_discharge_summary",
                          server: "Documentation",
                          calls: 15300,
                          avgTime: 140,
                          successRate: 99.6,
                          revenue: 765,
                        },
                        {
                          name: "validate_medication_dosage",
                          server: "Safety Checks",
                          calls: 12800,
                          avgTime: 45,
                          successRate: 99.9,
                          revenue: 640,
                        },
                      ].map((func, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Server className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium font-mono text-sm">
                                {func.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {func.server} Server
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="text-sm font-medium">
                                {func.calls.toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Calls
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium">
                                {func.avgTime}ms
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Avg Time
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium">
                                {func.successRate}%
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Success
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium">
                                ${func.revenue}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Revenue
                              </div>
                            </div>
                            <Badge
                              variant="default"
                              className="bg-green-100 text-green-800"
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="audit" className="h-[calc(100%-40px)] mt-4">
              <div className="space-y-6">
                {/* Billing Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Today's Revenue
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$8,247</div>
                      <p className="text-xs text-green-600">
                        +12% vs yesterday
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        API Calls
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">164,892</div>
                      <p className="text-xs text-muted-foreground">
                        Billable requests
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Active Clients
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">47</div>
                      <p className="text-xs text-muted-foreground">
                        EMR systems
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Monthly Growth
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+23%</div>
                      <p className="text-xs text-muted-foreground">
                        Usage increase
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Audit Log */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        MCP Service Consumption Audit
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        {
                          timestamp: "2024-01-15 14:32:15",
                          client: "MedFlow EMR",
                          function: "generate_clinical_note",
                          duration: 120,
                          cost: 0.05,
                          status: "success",
                          reference: "REF-789012",
                        },
                        {
                          timestamp: "2024-01-15 14:31:58",
                          client: "HealthTech Pro",
                          function: "extract_icd_codes",
                          duration: 65,
                          cost: 0.03,
                          status: "success",
                          reference: "REF-789011",
                        },
                        {
                          timestamp: "2024-01-15 14:31:42",
                          client: "ClinicalSoft",
                          function: "summarize_patient_history",
                          duration: 95,
                          cost: 0.04,
                          status: "success",
                          reference: "REF-789010",
                        },
                        {
                          timestamp: "2024-01-15 14:31:28",
                          client: "MedFlow EMR",
                          function: "analyze_lab_results",
                          duration: 180,
                          cost: 0.07,
                          status: "success",
                          reference: "REF-789009",
                        },
                        {
                          timestamp: "2024-01-15 14:31:15",
                          client: "DocuMed",
                          function: "generate_discharge_summary",
                          duration: 140,
                          cost: 0.06,
                          status: "success",
                          reference: "REF-789008",
                        },
                        {
                          timestamp: "2024-01-15 14:30:58",
                          client: "HealthTech Pro",
                          function: "validate_medication_dosage",
                          duration: 45,
                          cost: 0.02,
                          status: "success",
                          reference: "REF-789007",
                        },
                        {
                          timestamp: "2024-01-15 14:30:42",
                          client: "ClinicalSoft",
                          function: "generate_clinical_note",
                          duration: 115,
                          cost: 0.05,
                          status: "success",
                          reference: "REF-789006",
                        },
                        {
                          timestamp: "2024-01-15 14:30:28",
                          client: "MedFlow EMR",
                          function: "extract_icd_codes",
                          duration: 68,
                          cost: 0.03,
                          status: "success",
                          reference: "REF-789005",
                        },
                        {
                          timestamp: "2024-01-15 14:30:15",
                          client: "DocuMed",
                          function: "summarize_patient_history",
                          duration: 92,
                          cost: 0.04,
                          status: "success",
                          reference: "REF-789004",
                        },
                        {
                          timestamp: "2024-01-15 14:29:58",
                          client: "HealthTech Pro",
                          function: "analyze_lab_results",
                          duration: 175,
                          cost: 0.07,
                          status: "error",
                          reference: "REF-789003",
                        },
                      ].map((log, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg text-sm"
                        >
                          <div className="flex items-center gap-4">
                            <div className="font-mono text-xs text-muted-foreground">
                              {log.timestamp}
                            </div>
                            <div className="font-medium">{log.client}</div>
                            <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                              {log.function}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-xs">{log.duration}ms</div>
                            <div className="text-xs font-medium">
                              ${log.cost}
                            </div>
                            <div className="font-mono text-xs text-muted-foreground">
                              {log.reference}
                            </div>
                            <Badge
                              variant={
                                log.status === "success"
                                  ? "default"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {log.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Client Usage Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Client Usage Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          client: "MedFlow EMR",
                          calls: 45200,
                          revenue: 2260,
                          avgDuration: 98,
                          topFunction: "generate_clinical_note",
                        },
                        {
                          client: "HealthTech Pro",
                          calls: 38900,
                          revenue: 1945,
                          avgDuration: 87,
                          topFunction: "extract_icd_codes",
                        },
                        {
                          client: "ClinicalSoft",
                          calls: 28400,
                          revenue: 1420,
                          avgDuration: 105,
                          topFunction: "summarize_patient_history",
                        },
                        {
                          client: "DocuMed",
                          calls: 19600,
                          revenue: 980,
                          avgDuration: 112,
                          topFunction: "generate_discharge_summary",
                        },
                        {
                          client: "CarePlus EMR",
                          calls: 15300,
                          revenue: 765,
                          avgDuration: 95,
                          topFunction: "analyze_lab_results",
                        },
                      ].map((client, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Users className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium">{client.client}</div>
                              <div className="text-sm text-muted-foreground">
                                Top: {client.topFunction}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="text-sm font-medium">
                                {client.calls.toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                API Calls
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium">
                                ${client.revenue}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Revenue
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium">
                                {client.avgDuration}ms
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Avg Duration
                              </div>
                            </div>
                            <Badge
                              variant="default"
                              className="bg-blue-100 text-blue-800"
                            >
                              Active
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="h-[calc(100%-40px)] mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* API Key Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      AI Model API Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="font-medium">OpenAI GPT-4</Label>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700"
                          >
                            Connected
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          API Key: sk-...xyz123 (Last 7 chars)
                        </div>
                        <Button variant="outline" size="sm">
                          Update Key
                        </Button>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="font-medium">
                            Anthropic Claude
                          </Label>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700"
                          >
                            Connected
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          API Key: sk-ant-...abc789 (Last 6 chars)
                        </div>
                        <Button variant="outline" size="sm">
                          Update Key
                        </Button>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="font-medium">
                            Local Llama Model
                          </Label>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700"
                          >
                            Local
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          Endpoint: http://localhost:8080/v1
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>

                      <Button
                        className="w-full"
                        onClick={handleApiKeyManagement}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Model
                      </Button>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Default Model Priority</Label>
                      <Select defaultValue="local_first">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local_first">
                            Local Models First
                          </SelectItem>
                          <SelectItem value="cloud_first">
                            Cloud Models First
                          </SelectItem>
                          <SelectItem value="cost_optimized">
                            Cost Optimized
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Auto-failover</Label>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                {/* Security & Privacy */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security & Privacy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>HIPAA Compliance Mode</Label>
                        <p className="text-xs text-muted-foreground">
                          Enhanced data protection
                        </p>
                      </div>
                      <Switch defaultChecked disabled />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Data Anonymization</Label>
                        <p className="text-xs text-muted-foreground">
                          Remove PII from AI processing
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Audit Logging</Label>
                        <p className="text-xs text-muted-foreground">
                          Track all AI interactions
                        </p>
                      </div>
                      <Switch defaultChecked disabled />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Session Timeout (minutes)</Label>
                      <Input type="number" placeholder="30" min="5" max="120" />
                    </div>
                  </CardContent>
                </Card>

                {/* User Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      User Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Default Form Type</Label>
                      <Select defaultValue="progress_note">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="progress_note">
                            Progress Note
                          </SelectItem>
                          <SelectItem value="consultation">
                            Consultation
                          </SelectItem>
                          <SelectItem value="discharge">
                            Discharge Summary
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Auto-save drafts</Label>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Show AI confidence scores</Label>
                      <Switch defaultChecked />
                    </div>

                    <div className="space-y-2">
                      <Label>Interface Theme</Label>
                      <Select defaultValue="light">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* System Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5" />
                      System Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Version
                        </Label>
                        <p className="font-medium">EMR AI v2.1.0</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          MCP Version
                        </Label>
                        <p className="font-medium">1.0.3</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Last Update
                        </Label>
                        <p className="font-medium">Jan 15, 2024</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          License
                        </Label>
                        <p className="font-medium">Enterprise</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Check Updates
                      </Button>
                      <Button variant="outline" size="sm">
                        Export Logs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="demo" className="h-[calc(100%-40px)] mt-4">
              <div className="space-y-6">
                {/* Demo Header */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Open Source EMR Demo Center
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Experience our AI enhancement system with popular
                      open-source EMR platforms
                    </p>
                  </CardHeader>
                </Card>

                {/* Open Source EMR Systems */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      name: "OpenMRS",
                      version: "v3.0.0",
                      description: "Open-source medical record system platform",
                      website: "https://openmrs.org",
                      license: "Mozilla Public License 2.0",
                      features: [
                        "Patient Management",
                        "Clinical Data",
                        "Reporting",
                        "API Integration",
                      ],
                      demoData: {
                        patients: 1247,
                        encounters: 8934,
                        observations: 24567,
                        providers: 89,
                      },
                      status: "active",
                      aiEnhanced: true,
                    },
                    {
                      name: "OpenEMR",
                      version: "v7.0.2",
                      description:
                        "Full-featured electronic health records system",
                      website: "https://www.open-emr.org",
                      license: "GNU General Public License",
                      features: [
                        "EHR",
                        "Practice Management",
                        "Billing",
                        "Telemedicine",
                      ],
                      demoData: {
                        patients: 892,
                        encounters: 5634,
                        observations: 18923,
                        providers: 67,
                      },
                      status: "active",
                      aiEnhanced: true,
                    },
                    {
                      name: "GNU Health",
                      version: "v4.2.0",
                      description: "Hospital and health information system",
                      website: "https://www.gnuhealth.org",
                      license: "GNU General Public License v3",
                      features: [
                        "Hospital Management",
                        "Laboratory",
                        "Pharmacy",
                        "Genetics",
                      ],
                      demoData: {
                        patients: 634,
                        encounters: 3421,
                        observations: 12456,
                        providers: 45,
                      },
                      status: "demo",
                      aiEnhanced: false,
                    },
                  ].map((emr, index) => (
                    <Card key={index} className="relative">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{emr.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                emr.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {emr.status}
                            </Badge>
                            {emr.aiEnhanced && (
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700"
                              >
                                <Brain className="h-3 w-3 mr-1" />
                                AI Enhanced
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {emr.description}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          Version: {emr.version} • License: {emr.license}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-muted rounded-lg">
                              <div className="text-lg font-bold text-blue-600">
                                {emr.demoData.patients.toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Patients
                              </div>
                            </div>
                            <div className="text-center p-3 bg-muted rounded-lg">
                              <div className="text-lg font-bold text-green-600">
                                {emr.demoData.encounters.toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Encounters
                              </div>
                            </div>
                            <div className="text-center p-3 bg-muted rounded-lg">
                              <div className="text-lg font-bold text-purple-600">
                                {emr.demoData.observations.toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Observations
                              </div>
                            </div>
                            <div className="text-center p-3 bg-muted rounded-lg">
                              <div className="text-lg font-bold text-orange-600">
                                {emr.demoData.providers}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Providers
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm font-medium">
                              Key Features:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {emr.features.map((feature, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                const demoSystem = {
                                  id: `demo_${emr.name.toLowerCase().replace(/\s+/g, "_")}`,
                                  name: emr.name,
                                  version: emr.version,
                                  status: emr.status,
                                  lastSync: new Date().toLocaleString(),
                                  apiCalls: emr.demoData.encounters,
                                  isDemo: true,
                                };
                                handleSystemSelect(demoSystem);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Launch Demo
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(emr.website, "_blank")}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Learn More
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Demo Benefits */}
                <Card>
                  <CardHeader>
                    <CardTitle>Why Choose Our AI Enhancement?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center space-y-2">
                        <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                          <Zap className="h-6 w-6 text-blue-600" />
                        </div>
                        <h4 className="font-semibold">Seamless Integration</h4>
                        <p className="text-sm text-muted-foreground">
                          Connect with any EMR system using our MCP architecture
                          without disrupting existing workflows
                        </p>
                      </div>
                      <div className="text-center space-y-2">
                        <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                          <Shield className="h-6 w-6 text-green-600" />
                        </div>
                        <h4 className="font-semibold">HIPAA Compliant</h4>
                        <p className="text-sm text-muted-foreground">
                          Built-in privacy controls and data anonymization
                          ensure full compliance with healthcare regulations
                        </p>
                      </div>
                      <div className="text-center space-y-2">
                        <div className="p-3 bg-purple-100 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-purple-600" />
                        </div>
                        <h4 className="font-semibold">Cost Effective</h4>
                        <p className="text-sm text-muted-foreground">
                          Reduce documentation time by 60% and improve coding
                          accuracy by 94% with AI assistance
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="budget" className="h-[calc(100%-40px)] mt-4">
              <div className="space-y-6">
                {/* Budget Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Today's Spend
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$247.50</div>
                      <p className="text-xs text-muted-foreground">
                        $500 daily budget
                      </p>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Used</span>
                          <span>49.5%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: "49.5%" }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Weekly Spend
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$1,847</div>
                      <p className="text-xs text-muted-foreground">
                        $2,500 weekly budget
                      </p>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Used</span>
                          <span>73.9%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: "73.9%" }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Monthly Spend
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$6,247</div>
                      <p className="text-xs text-muted-foreground">
                        $10,000 monthly budget
                      </p>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Used</span>
                          <span>62.5%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: "62.5%" }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Projected Spend
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$8,420</div>
                      <p className="text-xs text-green-600">16% under budget</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Projected</span>
                          <span>84.2%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: "84.2%" }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Model Usage Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Token Usage by Model
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          provider: "OpenAI",
                          model: "GPT-4",
                          inputTokens: 1247000,
                          outputTokens: 892000,
                          inputCost: 37.41,
                          outputCost: 53.52,
                          totalCost: 90.93,
                          percentage: 36.7,
                        },
                        {
                          provider: "Anthropic",
                          model: "Claude-3 Sonnet",
                          inputTokens: 892000,
                          outputTokens: 634000,
                          inputCost: 2.68,
                          outputCost: 9.51,
                          totalCost: 12.19,
                          percentage: 4.9,
                        },
                        {
                          provider: "Local",
                          model: "Med-Llama 7B",
                          inputTokens: 2340000,
                          outputTokens: 1560000,
                          inputCost: 0,
                          outputCost: 0,
                          totalCost: 0,
                          percentage: 0,
                        },
                        {
                          provider: "OpenAI",
                          model: "GPT-3.5 Turbo",
                          inputTokens: 3420000,
                          outputTokens: 2180000,
                          inputCost: 5.13,
                          outputCost: 4.36,
                          totalCost: 9.49,
                          percentage: 3.8,
                        },
                        {
                          provider: "Google",
                          model: "Gemini Pro",
                          inputTokens: 1890000,
                          outputTokens: 1240000,
                          inputCost: 0.95,
                          outputCost: 1.86,
                          totalCost: 2.81,
                          percentage: 1.1,
                        },
                      ].map((usage, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              {usage.provider === "Local" ? (
                                <Database className="h-4 w-4 text-blue-600" />
                              ) : (
                                <Cloud className="h-4 w-4 text-blue-600" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{usage.model}</div>
                              <div className="text-sm text-muted-foreground">
                                {usage.provider} •{" "}
                                {(
                                  usage.inputTokens + usage.outputTokens
                                ).toLocaleString()}{" "}
                                tokens
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="text-sm font-medium">
                                {usage.inputTokens.toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Input
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium">
                                {usage.outputTokens.toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Output
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium">
                                ${usage.totalCost.toFixed(2)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {usage.percentage}% of budget
                              </div>
                            </div>
                            <div className="w-20">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{
                                    width: `${Math.min(usage.percentage, 100)}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Budget Alerts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Budget Alerts & Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <div className="flex-1">
                          <div className="font-medium text-yellow-800">
                            Weekly Budget Warning
                          </div>
                          <div className="text-sm text-yellow-700">
                            You've used 73.9% of your weekly budget. Consider
                            optimizing model usage.
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <div className="flex-1">
                          <div className="font-medium text-blue-800">
                            Cost Optimization Tip
                          </div>
                          <div className="text-sm text-blue-700">
                            Switch 40% of GPT-4 requests to local models to save
                            $180/month.
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <div className="flex-1">
                          <div className="font-medium text-green-800">
                            Efficiency Improvement
                          </div>
                          <div className="text-sm text-green-700">
                            Your token efficiency improved by 15% this week
                            through better prompt optimization.
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Budget Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Budget Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Daily Budget Limit</Label>
                        <Input type="number" placeholder="500" />
                        <p className="text-xs text-muted-foreground">
                          Maximum daily spend in USD
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Warning Threshold</Label>
                        <Input type="number" placeholder="80" />
                        <p className="text-xs text-muted-foreground">
                          Alert when % of budget is reached
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Auto-pause at</Label>
                        <Input type="number" placeholder="95" />
                        <p className="text-xs text-muted-foreground">
                          Pause AI when % of budget is reached
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button>Save Budget Settings</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* API Key Management Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                API Key Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Model Provider</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="google">Google Gemini</SelectItem>
                      <SelectItem value="local">Local Model</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>API Key / Endpoint</Label>
                  <Input
                    type="password"
                    placeholder="Enter API key or endpoint URL"
                  />
                </div>
                <div>
                  <Label>Model Name</Label>
                  <Input placeholder="e.g., gpt-4, claude-3-sonnet" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Enable for MCP</Label>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardContent className="flex justify-end gap-2 pt-0">
              <Button
                variant="outline"
                onClick={() => setShowApiKeyModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setShowApiKeyModal(false)}>
                Save Configuration
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Home;
