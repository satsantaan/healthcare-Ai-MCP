import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, RefreshCw, Shield } from "lucide-react";
import AIAssistancePanel from "./AIAssistancePanel";

interface EMRWorkspaceProps {
  systemData?: {
    id: string;
    name: string;
    version: string;
    status: string;
    lastSync: string;
    apiCalls: number;
    isDemo?: boolean;
  };
  aiEnabled?: boolean;
}

const EMRWorkspace = ({
  systemData = {
    id: "1",
    name: "MedFlow EMR",
    version: "v4.2.1",
    status: "active",
    lastSync: "2024-01-15 14:32:15",
    apiCalls: 45200,
    isDemo: true,
  },
  aiEnabled = true,
}: EMRWorkspaceProps) => {
  const [activeTab, setActiveTab] = useState("system_info");
  const [isAIEnabled, setIsAIEnabled] = useState(aiEnabled);
  const [isConnected, setIsConnected] = useState(true);
  const [mcpData, setMcpData] = useState({
    hl7Messages: 1247,
    fhirResources: 892,
    activeConnections: 24,
    lastActivity: "2024-01-15 14:32:15",
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMcpData((prev) => ({
        ...prev,
        hl7Messages: prev.hl7Messages + Math.floor(Math.random() * 5),
        fhirResources: prev.fhirResources + Math.floor(Math.random() * 3),
        activeConnections: Math.max(
          20,
          prev.activeConnections + Math.floor(Math.random() * 6) - 3,
        ),
        lastActivity: new Date().toLocaleString(),
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleMcpDataChange = (field: string, value: any) => {
    setMcpData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAIToggle = () => {
    setIsAIEnabled(!isAIEnabled);
  };

  const handleConnectionTest = async () => {
    setIsConnected(false);
    // Simulate connection test
    setTimeout(() => {
      setIsConnected(true);
    }, 2000);
  };

  return (
    <div className="flex h-full w-full bg-background">
      {/* Main EMR Form Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">MCP Integration Dashboard</h2>
            <p className="text-muted-foreground">
              System: {systemData.name} | Version: {systemData.version}
              {systemData.isDemo && (
                <Badge
                  variant="outline"
                  className="ml-2 bg-blue-50 text-blue-700"
                >
                  Demo Mode
                </Badge>
              )}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">
                  HIPAA Compliant
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-sm text-muted-foreground">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="ai-toggle" className="text-sm font-medium">
                AI Assistance
              </Label>
              <Switch
                id="ai-toggle"
                checked={isAIEnabled}
                onCheckedChange={handleAIToggle}
              />
            </div>

            <Select defaultValue="local_model">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local_model">
                  Local Clinical Model
                </SelectItem>
                <SelectItem value="cloud_gpt">Cloud GPT-4</SelectItem>
                <SelectItem value="med_llama">Med-Llama 7B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="mb-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>EMR System Information</CardTitle>
              <Badge
                variant={
                  systemData.status === "active" ? "default" : "secondary"
                }
              >
                {systemData.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>System Name</Label>
                <Input value={systemData.name} readOnly className="bg-muted" />
              </div>
              <div>
                <Label>Version</Label>
                <Input
                  value={systemData.version}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div>
                <Label>Last Sync</Label>
                <Input
                  value={systemData.lastSync}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div>
                <Label>API Calls Today</Label>
                <Input
                  value={systemData.apiCalls.toLocaleString()}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="system_info">System Info</TabsTrigger>
            <TabsTrigger value="hl7_fhir">HL7/FHIR</TabsTrigger>
            <TabsTrigger value="mcp_functions">MCP Functions</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="system_info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>MCP Connection Status</CardTitle>
                {systemData.isDemo && (
                  <p className="text-sm text-blue-600">
                    🎯 This is a live demo showing real-time integration with{" "}
                    {systemData.name}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {mcpData.hl7Messages}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      HL7 Messages Processed
                      {systemData.isDemo && (
                        <span className="text-blue-600"> (Demo Data)</span>
                      )}
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {mcpData.fhirResources}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      FHIR Resources Accessed
                      {systemData.isDemo && (
                        <span className="text-blue-600"> (Demo Data)</span>
                      )}
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {mcpData.activeConnections}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Active Connections
                      {systemData.isDemo && (
                        <span className="text-blue-600"> (Simulated)</span>
                      )}
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm font-medium">Last Activity</div>
                    <div className="text-sm text-muted-foreground">
                      {mcpData.lastActivity}
                      {systemData.isDemo && (
                        <span className="text-blue-600"> (Live Demo)</span>
                      )}
                    </div>
                  </div>
                </div>
                {systemData.isDemo && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        Demo Integration Active
                      </span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      This demo shows how our MCP architecture seamlessly
                      integrates with {systemData.name}. All data processing, AI
                      enhancements, and workflow optimizations work exactly as
                      shown in production.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integration Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">HL7 Message Processing</span>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" /> Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">FHIR API Connectivity</span>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" /> Connected
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">MCP Server Status</span>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" /> Online
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hl7_fhir" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>HL7/FHIR Message Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Recent HL7 Messages</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>ADT^A01 - Patient Admission</span>
                        <span className="text-muted-foreground">14:32:15</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ORU^R01 - Lab Results</span>
                        <span className="text-muted-foreground">14:31:58</span>
                      </div>
                      <div className="flex justify-between">
                        <span>MDM^T02 - Document Status</span>
                        <span className="text-muted-foreground">14:31:42</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">FHIR Resource Access</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Patient Resource</span>
                        <span className="text-muted-foreground">
                          1,247 requests
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Observation Resource</span>
                        <span className="text-muted-foreground">
                          892 requests
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>DiagnosticReport Resource</span>
                        <span className="text-muted-foreground">
                          634 requests
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mcp_functions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available MCP Functions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      name: "generate_clinical_note",
                      calls: 1247,
                      status: "active",
                    },
                    { name: "extract_icd_codes", calls: 892, status: "active" },
                    {
                      name: "summarize_patient_history",
                      calls: 634,
                      status: "active",
                    },
                    {
                      name: "validate_medication_dosage",
                      calls: 423,
                      status: "active",
                    },
                    {
                      name: "analyze_lab_results",
                      calls: 312,
                      status: "active",
                    },
                  ].map((func, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium font-mono text-sm">
                          {func.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {func.calls} calls today
                        </div>
                      </div>
                      <Badge
                        variant={
                          func.status === "active" ? "default" : "secondary"
                        }
                      >
                        {func.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-lg font-bold">98.7%</div>
                    <div className="text-sm text-muted-foreground">
                      Success Rate
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-lg font-bold">127ms</div>
                    <div className="text-sm text-muted-foreground">
                      Avg Response Time
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-lg font-bold">24</div>
                    <div className="text-sm text-muted-foreground">
                      Active Sessions
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-lg font-bold">$247.50</div>
                    <div className="text-sm text-muted-foreground">
                      Today's Revenue
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleConnectionTest}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Test Connection
              </Button>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              <Button>
                <AlertCircle className="h-4 w-4 mr-2" />
                View Alerts
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Assistance Panel */}
      {isAIEnabled && (
        <div className="w-[400px] border-l">
          <AIAssistancePanel systemData={systemData} mcpData={mcpData} />
        </div>
      )}
    </div>
  );
};

export default EMRWorkspace;
