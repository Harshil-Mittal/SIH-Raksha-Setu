import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home,
  MapPin,
  Calendar,
  Phone,
  Shield,
  Star,
  Clock,
  AlertTriangle,
  Bookmark,
  Navigation,
  Camera,
  FileText,
  BarChart3,
  Users,
  Settings
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: 'map' | 'trips') => void;
}

const HomeDialog: React.FC<HomeDialogProps> = ({ isOpen, onClose, onNavigate }) => {
  const { auth } = useAuth();
  
  const getTouristActions = () => [
    {
      icon: MapPin,
      label: 'Map View',
      description: 'Safe zones & alerts',
      action: () => {
        onNavigate('map');
        onClose();
      },
      color: 'text-primary'
    },
    {
      icon: Calendar,
      label: 'My Trips',
      description: 'Itinerary & warnings',
      action: () => {
        onNavigate('trips');
        onClose();
      },
      color: 'text-primary'
    },
    {
      icon: Phone,
      label: 'Emergency Call',
      description: 'Tourist helpline',
      action: () => window.open('tel:+911234567890'),
      color: 'text-emergency'
    },
    {
      icon: Camera,
      label: 'Report Issue',
      description: 'Send photo report',
      action: () => alert('Camera feature coming soon'),
      color: 'text-warning'
    }
  ];

  const getAdminActions = () => [
    {
      icon: BarChart3,
      label: 'Analytics',
      description: 'View system metrics',
      action: () => alert('Navigate to analytics'),
      color: 'text-primary'
    },
    {
      icon: Users,
      label: 'User Management',
      description: 'Manage users & roles',
      action: () => alert('Navigate to user management'),
      color: 'text-primary'
    },
    {
      icon: Shield,
      label: 'Security Center',
      description: 'Monitor threats',
      action: () => alert('Navigate to security center'),
      color: 'text-warning'
    },
    {
      icon: Settings,
      label: 'System Config',
      description: 'Configure settings',
      action: () => alert('Navigate to system config'),
      color: 'text-muted-foreground'
    }
  ];

  const quickActions = auth.user?.role === 'tourist' ? getTouristActions() : getAdminActions();

  const getTouristActivities = () => [
    {
      icon: MapPin,
      title: 'Visited Central Market',
      time: '2 hours ago',
      status: 'safe'
    },
    {
      icon: AlertTriangle,
      title: 'Safety alert received',
      time: '4 hours ago',
      status: 'warning'
    },
    {
      icon: Calendar,
      title: 'Trip updated',
      time: '1 day ago',
      status: 'info'
    }
  ];

  const getAdminActivities = () => [
    {
      icon: BarChart3,
      title: 'System metrics updated',
      time: '1 hour ago',
      status: 'info'
    },
    {
      icon: Users,
      title: 'New user registered',
      time: '3 hours ago',
      status: 'safe'
    },
    {
      icon: AlertTriangle,
      title: 'Security alert resolved',
      time: '5 hours ago',
      status: 'warning'
    }
  ];

  const recentActivities = auth.user?.role === 'tourist' ? getTouristActivities() : getAdminActivities();

  const getTouristLocations = () => [
    { name: 'Palace Museum', safety: 'High', visits: 3 },
    { name: 'Central Market', safety: 'Medium', visits: 5 },
    { name: 'Heritage Walk', safety: 'High', visits: 2 }
  ];

  const getAdminLocations = () => [
    { name: 'Control Center', safety: 'High', visits: 10 },
    { name: 'Security Hub', safety: 'High', visits: 8 },
    { name: 'Data Center', safety: 'Medium', visits: 5 }
  ];

  const favoriteLocations = auth.user?.role === 'tourist' ? getTouristLocations() : getAdminLocations();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-success';
      case 'warning': return 'text-warning';
      case 'info': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getSafetyBadge = (safety: string) => {
    switch (safety) {
      case 'High': return 'bg-success text-white';
      case 'Medium': return 'bg-warning text-white';
      case 'Low': return 'bg-emergency text-white';
      default: return 'bg-muted';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            {auth.user?.role === 'tourist' ? 'Quick Access' : 'Dashboard Hub'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2"
                    onClick={action.action}
                  >
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                    <div className="text-left">
                      <div className="font-medium text-sm">{action.label}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <activity.icon className={`w-4 h-4 ${getStatusColor(activity.status)}`} />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{activity.title}</div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Favorite Locations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                {auth.user?.role === 'tourist' ? 'Favorite Locations' : 'Frequent Areas'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {favoriteLocations.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <div>
                        <div className="text-sm font-medium">{location.name}</div>
                        <div className="text-xs text-muted-foreground">{location.visits} visits</div>
                      </div>
                    </div>
                    <Badge className={getSafetyBadge(location.safety)}>
                      {location.safety}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Safety Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-success animate-pulse"></div>
                  <div>
                    <div className="text-sm font-medium">All systems operational</div>
                    <div className="text-xs text-muted-foreground">Last updated: 2 minutes ago</div>
                  </div>
                </div>
                <Badge className="bg-success text-white">Safe</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HomeDialog;