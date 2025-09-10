import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Search, 
  Filter,
  Eye,
  MapPin,
  Clock,
  Shield,
  AlertTriangle,
  Phone,
  ArrowLeft,
  Download
} from 'lucide-react';

interface TouristManagementProps {
  onBack: () => void;
}

const TouristManagement: React.FC<TouristManagementProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTourist, setSelectedTourist] = useState<number | null>(null);

  const tourists = [
    {
      id: 1,
      digitalId: 'TRS-2024-001',
      name: 'John Smith',
      nationality: 'American',
      phone: '+1-555-0123',
      email: 'john.smith@email.com',
      status: 'active',
      safetyScore: 92,
      currentLocation: 'India Gate, New Delhi',
      lastSeen: new Date(Date.now() - 10 * 60 * 1000),
      tripDuration: '5 days',
      alertCount: 0,
      emergencyContact: '+1-555-9876'
    },
    {
      id: 2,
      digitalId: 'TRS-2024-045',
      name: 'Maria Garcia',
      nationality: 'Spanish',
      phone: '+34-612-345-678',
      email: 'maria.garcia@email.com',
      status: 'alert',
      safetyScore: 65,
      currentLocation: 'Military Cantonment Area',
      lastSeen: new Date(Date.now() - 15 * 60 * 1000),
      tripDuration: '3 days',
      alertCount: 2,
      emergencyContact: '+34-612-987-654'
    },
    {
      id: 3,
      digitalId: 'TRS-2024-023',
      name: 'Ahmed Hassan',
      nationality: 'Egyptian',
      phone: '+20-10-1234-5678',
      email: 'ahmed.hassan@email.com',
      status: 'monitoring',
      safetyScore: 78,
      currentLocation: 'Old City Heritage District',
      lastSeen: new Date(Date.now() - 30 * 60 * 1000),
      tripDuration: '7 days',
      alertCount: 1,
      emergencyContact: '+20-10-9876-5432'
    },
    {
      id: 4,
      digitalId: 'TRS-2024-067',
      name: 'Li Wei',
      nationality: 'Chinese',
      phone: '+86-138-0013-8000',
      email: 'li.wei@email.com',
      status: 'safe',
      safetyScore: 95,
      currentLocation: 'Lotus Temple',
      lastSeen: new Date(Date.now() - 5 * 60 * 1000),
      tripDuration: '4 days',
      alertCount: 0,
      emergencyContact: '+86-138-9999-8888'
    },
    {
      id: 5,
      digitalId: 'TRS-2024-012',
      name: 'Robert Johnson',
      nationality: 'British',
      phone: '+44-7700-900123',
      email: 'robert.johnson@email.com',
      status: 'offline',
      safetyScore: 82,
      currentLocation: 'Hotel Taj Palace',
      lastSeen: new Date(Date.now() - 120 * 60 * 1000),
      tripDuration: '6 days',
      alertCount: 0,
      emergencyContact: '+44-7700-900456'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'alert': return 'bg-red-500';
      case 'monitoring': return 'bg-yellow-500';
      case 'safe': return 'bg-blue-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'alert': return 'destructive';
      case 'monitoring': return 'secondary';
      case 'safe': return 'default';
      case 'offline': return 'secondary';
      default: return 'secondary';
    }
  };

  const getSafetyScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredTourists = tourists.filter(tourist => {
    const matchesStatus = statusFilter === 'all' || tourist.status === statusFilter;
    const matchesSearch = tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tourist.digitalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tourist.nationality.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold">Tourist Management</h1>
            <Badge variant="outline">
              {filteredTourists.length} Total
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm" variant="outline">
              <MapPin className="w-4 h-4 mr-2" />
              Map View
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-muted/20 border-b">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, or nationality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="alert">Alert</SelectItem>
              <SelectItem value="monitoring">Monitoring</SelectItem>
              <SelectItem value="safe">Safe</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tourist List */}
      <div className="p-4 space-y-3">
        {filteredTourists.map((tourist) => (
          <Card key={tourist.id} className={`cursor-pointer transition-all ${
            tourist.status === 'alert' ? 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20' : ''
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(tourist.status)}`}></div>
                    <Badge variant={getStatusBadge(tourist.status)}>
                      {tourist.status.toUpperCase()}
                    </Badge>
                    {tourist.alertCount > 0 && (
                      <Badge variant="destructive">
                        {tourist.alertCount} Alert{tourist.alertCount > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{tourist.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{tourist.digitalId} • {tourist.nationality}</p>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getSafetyScoreColor(tourist.safetyScore)}`}>
                    {tourist.safetyScore}%
                  </div>
                  <div className="text-xs text-muted-foreground">Safety Score</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <MapPin className="w-3 h-3" />
                    Current Location
                  </div>
                  <p className="font-medium">{tourist.currentLocation}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <Clock className="w-3 h-3" />
                    Last Seen
                  </div>
                  <p className="font-medium">{formatTimeAgo(tourist.lastSeen)}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <Phone className="w-3 h-3" />
                    Contact
                  </div>
                  <p className="font-medium">{tourist.phone}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <Shield className="w-3 h-3" />
                    Trip Duration
                  </div>
                  <p className="font-medium">{tourist.tripDuration}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t flex items-center justify-between">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    View Profile
                  </Button>
                  <Button size="sm" variant="outline">
                    <MapPin className="w-4 h-4 mr-1" />
                    Track
                  </Button>
                  {tourist.status === 'alert' && (
                    <Button size="sm" variant="default">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Respond
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTourists.length === 0 && (
        <div className="text-center py-8">
          <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No tourists match your current filters</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="p-4 border-t bg-muted/20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-600">
              {tourists.filter(t => t.status === 'active').length}
            </div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-600">
              {tourists.filter(t => t.status === 'alert').length}
            </div>
            <div className="text-xs text-muted-foreground">Alerts</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600">
              {tourists.filter(t => t.status === 'monitoring').length}
            </div>
            <div className="text-xs text-muted-foreground">Monitoring</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              {tourists.filter(t => t.status === 'safe').length}
            </div>
            <div className="text-xs text-muted-foreground">Safe</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-600">
              {tourists.filter(t => t.status === 'offline').length}
            </div>
            <div className="text-xs text-muted-foreground">Offline</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristManagement;