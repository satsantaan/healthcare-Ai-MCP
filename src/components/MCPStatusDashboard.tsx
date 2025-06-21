import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Activity,
  Server,
  Database,
  Cloud,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";

interface MCPStatusDashboardProps {
  refreshInterval?: number;
  showDetailedMetrics?: boolean;
}

const MCPStatusDashboard = ({
  refreshInterval = 30000,
  showDetailedMetrics = true,
}: MCPStatusDashboardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [systemHealth, setSystemHealth] = useState({
    overall: 98.7,
    client: 99.2,
    server: 98.1,
    models: 97.8,
  });

  // Mock real-time data
  const [mcpMetrics, setMcpMetrics] = useState({
    activeConnections: 47,
    totalRequests: 164892,
    avgResponseTime: 127,
    errorRate: 0.12,
    throughput: 1247,
    uptime: 99.9,
  });

  const [serverStatus, setServerStatus] = useState([
    {
      name: "Clinical Documentation Server",
      status: "healthy",
      load: 68,
      requests: 45200,
      avgTime: 120,
      errors: 0.08,
    },
    {
      name: "Billing & Coding Server",
      status: "healthy",
      load: 72,
      requests: 38900,
      avgTime: 85,
      errors: 0.05,
    },
    {
      name: "Summary Generation Server",
      status: "healthy",
      load: 45,
      requests: 28400,
      avgTime: 95,
      errors: 0.15,
    },
    {
      name: "Medical Imaging Server",
      status: "warning",
      load: 89,
      requests: 12600,
      avgTime: 340,
      errors: 0.28,
    },
    {
      name: "Safety Validation Server",
      status: "healthy",
      load: 34,
      requests: 19800,
      avgTime: 45,
      errors: 0.02,
    },
    {
      name: "Analytics Server",
      status: "healthy",
      load: 56,
      requests: 15700,
      avgTime: 78,
      errors: 0.11,
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics with slight variations
      setMcpMetrics((prev) => ({
        ...prev,
        activeConnections: Math.max(
          20,
          prev.activeConnections + Math.floor(Math.random() * 6) - 3,
        ),
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 50) + 10,
        avgResponseTime: Math.max(
          80,
          prev.avgResponseTime + Math.floor(Math.random() * 20) - 10,
        ),
        throughput: Math.max(
          1000,
          prev.throughput + Math.floor(Math.random() * 200) - 100,
        ),
      }));

      // Update server loads
      setServerStatus((prev) =>
        prev.map((server) => ({
          ...server,
          load: Math.max(
            10,
            Math.min(95, server.load + Math.floor(Math.random() * 10) - 5),
          ),
          requests: server.requests + Math.floor(Math.random() * 20) + 5,
        })),
      );

      setLastUpdated(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setLastUpdated(new Date());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "error":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 bg-background">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">MCP Architecture Status</h3>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Overall Health
                </p>
                <p className="text-2xl font-bold">{systemHealth.overall}%</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <Activity className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <Progress value={systemHealth.overall} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Connections
                </p>
                <p className="text-2xl font-bold">
                  {mcpMetrics.activeConnections}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              EMR systems connected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg Response Time
                </p>
                <p className="text-2xl font-bold">
                  {mcpMetrics.avgResponseTime}ms
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <Zap className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              -8% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Throughput
                </p>
                <p className="text-2xl font-bold">
                  {mcpMetrics.throughput.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-full">
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">requests/hour</p>
          </CardContent>
        </Card>
      </div>

      {/* MCP Server Status */}
      {showDetailedMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              MCP Server Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serverStatus.map((server, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Server className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{server.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {server.requests.toLocaleString()} requests today
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-sm font-medium">{server.load}%</div>
                      <div className="text-xs text-muted-foreground">Load</div>
                      <Progress value={server.load} className="w-16 mt-1" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {server.avgTime}ms
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Avg Time
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {server.errors}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Errors
                      </div>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="outline"
                            className={getStatusColor(server.status)}
                          >
                            {getStatusIcon(server.status)}
                            <span className="ml-1 capitalize">
                              {server.status}
                            </span>
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Server is {server.status} with {server.load}% load
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Architecture Components */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="h-4 w-4" />
              Client Layer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>EMR Integration</span>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Active
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Form Handler</span>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Active
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Privacy Engine</span>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Active
                </Badge>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                Health: {systemHealth.client}%
              </div>
              <Progress value={systemHealth.client} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Server className="h-4 w-4" />
              Server Ecosystem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Request Router</span>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Active
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Function Servers</span>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  6 Online
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Load Balancer</span>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Active
                </Badge>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                Health: {systemHealth.server}%
              </div>
              <Progress value={systemHealth.server} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              AI Model Layer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Local Models</span>
                <Badge variant="default" className="bg-blue-100 text-blue-800">
                  8 Active
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Cloud APIs</span>
                <Badge
                  variant="default"
                  className="bg-purple-100 text-purple-800"
                >
                  12 Connected
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Model Router</span>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Active
                </Badge>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                Health: {systemHealth.models}%
              </div>
              <Progress value={systemHealth.models} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="text-center p-3 border rounded-lg">
          <div className="text-lg font-bold text-green-600">
            {mcpMetrics.totalRequests.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Total Requests</div>
        </div>
        <div className="text-center p-3 border rounded-lg">
          <div className="text-lg font-bold text-blue-600">
            {mcpMetrics.uptime}%
          </div>
          <div className="text-xs text-muted-foreground">Uptime</div>
        </div>
        <div className="text-center p-3 border rounded-lg">
          <div className="text-lg font-bold text-purple-600">
            {mcpMetrics.errorRate}%
          </div>
          <div className="text-xs text-muted-foreground">Error Rate</div>
        </div>
        <div className="text-center p-3 border rounded-lg">
          <div className="text-lg font-bold text-orange-600">24</div>
          <div className="text-xs text-muted-foreground">Active Functions</div>
        </div>
        <div className="text-center p-3 border rounded-lg">
          <div className="text-lg font-bold text-red-600">$8,247</div>
          <div className="text-xs text-muted-foreground">Revenue Today</div>
        </div>
        <div className="text-center p-3 border rounded-lg">
          <div className="text-lg font-bold text-gray-600">47</div>
          <div className="text-xs text-muted-foreground">EMR Systems</div>
        </div>
      </div>
    </div>
  );
};

export default MCPStatusDashboard;
