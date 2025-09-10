import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Activity, 
  Server, 
  Database, 
  Wifi,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Monitor,
  Globe,
  Cpu,
  HardDrive,
  MemoryStick
} from 'lucide-react';

interface SystemHealthProps {
  onBack: () => void;
}

const SystemHealth: React.FC<SystemHealthProps> = ({ onBack }) => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock system data
  const [systemData, setSystemData] = useState({
    api: {
      status: 'healthy',
      responseTime: 245,
      uptime: '99.8%',
      requests: 15420,
      errors: 12
    },
    database: {
      status: 'healthy',
      connections: 45,
      maxConnections: 100,
      queryTime: 1.2,
      storage: 78
    },
    websocket: {
      status: 'healthy',
      connections: 892,
      maxConnections: 5000,
      messagesSent: 45231,
      messagesReceived: 38942
    },
    server: {
      cpu: 42,
      memory: 68,
      disk: 55,
      network: 23
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemData(prev => ({
        ...prev,
        api: {
          ...prev.api,
          responseTime: Math.floor(Math.random() * 100) + 200,
          requests: prev.api.requests + Math.floor(Math.random() * 10) + 1
        },
        database: {
          ...prev.database,
          connections: Math.floor(Math.random() * 20) + 35,
          queryTime: Math.random() * 0.5 + 1
        },
        websocket: {
          ...prev.websocket,
          connections: Math.floor(Math.random() * 50) + 850,
          messagesSent: prev.websocket.messagesSent + Math.floor(Math.random() * 50) + 10
        },
        server: {
          cpu: Math.floor(Math.random() * 20) + 35,
          memory: Math.floor(Math.random() * 15) + 60,
          disk: Math.floor(Math.random() * 10) + 50,
          network: Math.floor(Math.random() * 30) + 15
        }
      }));
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-semibold">System Health</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Overall Status */}
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <h2 className="text-xl font-semibold text-green-800">All Systems Operational</h2>
                  <p className="text-green-600">All services are running normally</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800" variant="secondary">
                Healthy
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Service Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* API Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                API Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(systemData.api.status)}
                    <Badge className={getStatusColor(systemData.api.status)} variant="secondary">
                      {systemData.api.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Response Time</span>
                  <span className="font-mono">{systemData.api.responseTime}ms</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Uptime</span>
                  <span className="font-mono text-green-600">{systemData.api.uptime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Requests Today</span>
                  <span className="font-mono">{systemData.api.requests.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Errors</span>
                  <span className="font-mono text-red-600">{systemData.api.errors}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Database Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(systemData.database.status)}
                    <Badge className={getStatusColor(systemData.database.status)} variant="secondary">
                      {systemData.database.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Connections</span>
                  <span className="font-mono">{systemData.database.connections}/{systemData.database.maxConnections}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Connection Usage</span>
                    <span className="font-mono">{Math.round((systemData.database.connections / systemData.database.maxConnections) * 100)}%</span>
                  </div>
                  <Progress value={(systemData.database.connections / systemData.database.maxConnections) * 100} className="h-2" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Avg Query Time</span>
                  <span className="font-mono">{systemData.database.queryTime.toFixed(1)}ms</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Storage Used</span>
                  <span className="font-mono">{systemData.database.storage}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WebSocket Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Wifi className="w-5 h-5" />
                WebSocket
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(systemData.websocket.status)}
                    <Badge className={getStatusColor(systemData.websocket.status)} variant="secondary">
                      {systemData.websocket.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Active Connections</span>
                  <span className="font-mono">{systemData.websocket.connections.toLocaleString()}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Capacity</span>
                    <span className="font-mono">{Math.round((systemData.websocket.connections / systemData.websocket.maxConnections) * 100)}%</span>
                  </div>
                  <Progress value={(systemData.websocket.connections / systemData.websocket.maxConnections) * 100} className="h-2" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Messages Sent</span>
                  <span className="font-mono">{systemData.websocket.messagesSent.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Server Resources */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Server Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">CPU Usage</span>
                </div>
                <div className="text-2xl font-bold">{systemData.server.cpu}%</div>
                <Progress value={systemData.server.cpu} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MemoryStick className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Memory</span>
                </div>
                <div className="text-2xl font-bold">{systemData.server.memory}%</div>
                <Progress value={systemData.server.memory} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Disk Space</span>
                </div>
                <div className="text-2xl font-bold">{systemData.server.disk}%</div>
                <Progress value={systemData.server.disk} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">Network</span>
                </div>
                <div className="text-2xl font-bold">{systemData.server.network}%</div>
                <Progress value={systemData.server.network} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Recent System Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: '10:30', event: 'Database backup completed successfully', type: 'success' },
                { time: '09:45', event: 'High CPU usage detected (85%)', type: 'warning' },
                { time: '09:15', event: 'WebSocket connection pool expanded', type: 'info' },
                { time: '08:30', event: 'API rate limiting activated', type: 'warning' },
                { time: '08:00', event: 'System health check completed', type: 'success' }
              ].map((event, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    event.type === 'success' ? 'bg-green-500' :
                    event.type === 'warning' ? 'bg-yellow-500' :
                    event.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="text-sm">{event.event}</div>
                    <div className="text-xs text-muted-foreground">{event.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemHealth;