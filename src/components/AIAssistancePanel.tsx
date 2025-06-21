import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Settings,
  Zap,
  FileText,
  Code,
  FileBarChart,
} from "lucide-react";

interface AIAssistancePanelProps {
  systemData?: Record<string, any>;
  mcpData?: Record<string, any>;
  onSuggestionAccept?: (suggestion: any) => void;
  onSuggestionReject?: (suggestion: any) => void;
  onRefresh?: () => void;
  activeModels?: string[];
}

const AIAssistancePanel = ({
  systemData = {},
  mcpData = {},
  onSuggestionAccept = () => {},
  onSuggestionReject = () => {},
  onRefresh = () => {},
  activeModels = ["Clinical Documentation", "Billing & Coding"],
}: AIAssistancePanelProps) => {
  const [activeTab, setActiveTab] = useState("documentation");
  const [aiConfidence, setAiConfidence] = useState(85);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connected");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Auto-refresh functionality
  useEffect(() => {
    if (isAutoRefresh) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
        // Simulate connection status check
        const statuses = ["connected", "degraded"];
        const randomStatus = Math.random() > 0.1 ? "connected" : "degraded";
        setConnectionStatus(randomStatus);
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [isAutoRefresh]);

  // Mock MCP function suggestions based on the active tab
  const suggestions = {
    documentation: [
      {
        id: "doc1",
        text: "HL7 ADT^A01 message processing optimized - 15% faster patient admission workflows detected",
        confidence: 92,
        source: "Clinical Documentation Model",
      },
      {
        id: "doc2",
        text: "FHIR Patient resource validation improved - recommend updating schema to R4.0.1",
        confidence: 88,
        source: "Clinical Documentation Model",
      },
    ],
    coding: [
      {
        id: "code1",
        text: "ICD-10 code extraction accuracy improved to 94.2% with latest model update",
        confidence: 89,
        source: "Billing & Coding Model",
      },
      {
        id: "code2",
        text: "CPT code validation flagged 12 potential billing discrepancies for review",
        confidence: 76,
        source: "Billing & Coding Model",
      },
    ],
    summary: [
      {
        id: "sum1",
        text: "MCP function performance summary: 24,847 successful calls, 0.12% error rate, $8,247 revenue generated today",
        confidence: 91,
        source: "Summary Generation Model",
      },
    ],
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onRefresh();
    }, 1500);
  };

  const handleAcceptSuggestion = (suggestion: any) => {
    onSuggestionAccept(suggestion);
  };

  const handleRejectSuggestion = (suggestion: any) => {
    onSuggestionReject(suggestion);
  };

  return (
    <div className="h-full flex flex-col bg-background border-l">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">AI Assistance</h3>
          <p className="text-sm text-muted-foreground">
            Powered by MCP Architecture
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeModels.map((model) => (
            <Badge
              key={model}
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              <span className="mr-1 h-2 w-2 rounded-full bg-green-500 inline-block"></span>
              {model}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="border-b px-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger
              value="documentation"
              className="flex items-center gap-1"
            >
              <FileText className="h-4 w-4" />
              Documentation
            </TabsTrigger>
            <TabsTrigger value="coding" className="flex items-center gap-1">
              <Code className="h-4 w-4" />
              Coding
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-1">
              <FileBarChart className="h-4 w-4" />
              Summary
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <TabsContent value="documentation" className="mt-0 h-full">
            <div className="space-y-4">
              {suggestions.documentation.map((suggestion) => (
                <SuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onAccept={() => handleAcceptSuggestion(suggestion)}
                  onReject={() => handleRejectSuggestion(suggestion)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="coding" className="mt-0 h-full">
            <div className="space-y-4">
              {suggestions.coding.map((suggestion) => (
                <SuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onAccept={() => handleAcceptSuggestion(suggestion)}
                  onReject={() => handleRejectSuggestion(suggestion)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="summary" className="mt-0 h-full">
            <div className="space-y-4">
              {suggestions.summary.map((suggestion) => (
                <SuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onAccept={() => handleAcceptSuggestion(suggestion)}
                  onReject={() => handleRejectSuggestion(suggestion)}
                />
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <div className="border-t p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Confidence Threshold</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Only show suggestions above this confidence level</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <span className="text-sm font-medium">{aiConfidence}%</span>
        </div>
        <Slider
          value={[aiConfidence]}
          onValueChange={(values) => setAiConfidence(values[0])}
          min={50}
          max={100}
          step={1}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Auto-refresh</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Automatically refresh suggestions as you type</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch checked={isAutoRefresh} onCheckedChange={setIsAutoRefresh} />
        </div>

        <Button
          onClick={handleRefresh}
          className="w-full"
          variant="outline"
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          {isLoading ? "Refreshing..." : "Refresh Suggestions"}
        </Button>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>MCP Status: Active</span>
            <div className="flex items-center gap-1">
              <div
                className={`h-2 w-2 rounded-full ${
                  connectionStatus === "connected"
                    ? "bg-green-500"
                    : "bg-amber-500"
                }`}
              />
              <span className="capitalize">{connectionStatus}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              <span>HL7/FHIR: Connected</span>
            </div>
            <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SuggestionCardProps {
  suggestion: {
    id: string;
    text: string;
    confidence: number;
    source: string;
  };
  onAccept: () => void;
  onReject: () => void;
}

const SuggestionCard = ({
  suggestion,
  onAccept,
  onReject,
}: SuggestionCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium">AI Suggestion</CardTitle>
          <Badge
            variant={suggestion.confidence > 85 ? "default" : "outline"}
            className="text-xs"
          >
            {suggestion.confidence}% Confidence
          </Badge>
        </div>
        <CardDescription className="text-xs">
          {suggestion.source}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{suggestion.text}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-0">
        <Button variant="ghost" size="sm" onClick={onReject}>
          Reject
        </Button>
        <Button size="sm" onClick={onAccept}>
          <CheckCircle className="h-4 w-4 mr-1" /> Accept
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIAssistancePanel;
