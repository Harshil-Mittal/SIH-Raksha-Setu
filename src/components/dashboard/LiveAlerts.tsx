import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Search, 
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  ArrowLeft
} from 'lucide-react';

interface LiveAlertsProps {
  onBack: () => void;
}

const LiveAlerts: React.FC<LiveAlertsProps> = ({ onBack }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const alerts = [
    {
      id: 1,
      type: 'panic',
      severity: 'critical',
      title: 'Tourist Panic Alert',
      description: 'Emergency SOS activated by tourist in Central Market area',
      location: 'Central Market, Block A',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'active',
      touristId: 'TRS-2024-001',
      touristName: 'John Smith',
      assignedTo: 'Officer Kumar'
    },
    {
      id: 2,
      type: 'geofence',
      severity: 'moderate',
      title: 'Restricted Zone Entry',
      description: 'Tourist entered restricted military area',
      location: 'Military Cantonment Area',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: 'investigating',
      touristId: 'TRS-2024-045',
      touristName: 'Maria Garcia',
      assignedTo: 'Officer Singh'
    },
    {
      id: 3,
      type: 'anomaly',
      severity: 'low',
      title: 'Unusual Movement Pattern',
      description: 'Tourist showing erratic movement in Old City area',
      location: 'Old City Heritage District',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'monitoring',
      touristId: 'TRS-2024-023',
      touristName: 'Ahmed Hassan',
      assignedTo: 'Officer Patel'
    },
    {
      id: 4,
      type: 'panic',
      severity: 'critical',
      title: 'Medical Emergency',
      description: 'Tourist requested medical assistance via SOS',
      location: 'Railway Station Platform 3',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: 'resolved',
      touristId: 'TRS-2024-067',
      touristName: 'Li Wei',
      assignedTo: 'Officer Sharma'
    },
    {
      id: 5,
      type: 'geofence',
      severity: 'moderate',
      title: 'Curfew Zone Entry',
      description: 'Tourist entered area under night curfew',
      location: 'Industrial Area Zone 2',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      status: 'resolved',
      touristId: 'TRS-2024-012',
      touristName: 'Robert Johnson',
      assignedTo: 'Officer Gupta'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'moderate': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500';
      case 'investigating': return 'bg-yellow-500';
      case 'monitoring': return 'bg-blue-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === 'all' || alert.severity === filter || alert.status === filter;
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.touristName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold">Live Alerts Feed</h1>
            <Badge variant="destructive" className="animate-pulse">
              {alerts.filter(a => a.status === 'active').length} Active
            </Badge>
          </div>
          <Button size="sm" variant="outline">
            Sound On
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-muted/20 border-b">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search alerts, tourists, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <SelectValue placeholder="Filter alerts" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Alerts</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="p-4 space-y-3">
        {filteredAlerts.map((alert) => (
          <Card key={alert.id} className={`${alert.status === 'active' ? 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(alert.status)}`}></div>
                    <Badge variant={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{alert.type}</Badge>
                  </div>
                  <CardTitle className="text-base">{alert.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  {alert.status === 'active' && (
                    <Button size="sm" variant="default">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Respond
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <MapPin className="w-3 h-3" />
                    Location
                  </div>
                  <p className="font-medium">{alert.location}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <Clock className="w-3 h-3" />
                    Time
                  </div>
                  <p className="font-medium">{alert.timestamp.toLocaleTimeString()}</p>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Tourist</div>
                  <p className="font-medium">{alert.touristName}</p>
                  <p className="text-xs text-muted-foreground">{alert.touristId}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-muted-foreground">Assigned to: </span>
                  <span className="font-medium">{alert.assignedTo}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Status: <span className="capitalize font-medium">{alert.status}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No alerts match your current filters</p>
        </div>
      )}
    </div>
  );
};

export default LiveAlerts;