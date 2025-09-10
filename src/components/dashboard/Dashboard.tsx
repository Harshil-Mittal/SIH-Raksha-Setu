import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MapPin, 
  AlertTriangle, 
  FileText, 
  Activity,
  BarChart3,
  Shield,
  UserCheck,
  Settings as SettingsIcon,
  Bell
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import InteractiveMap from '../map/InteractiveMap';
import LiveAlerts from './LiveAlerts';
import TouristManagement from './TouristManagement';
import ZoneManagement from './ZoneManagement';
import AnalyticsDashboard from './AnalyticsDashboard';
import EFIRManagement from './EFIRManagement';
import RoleManagement from './RoleManagement';
import SystemHealth from './SystemHealth';

const Dashboard: React.FC = () => {
  const { auth } = useAuth();
  const userRole = auth.user?.role;
  const [currentView, setCurrentView] = useState<'dashboard' | 'alerts' | 'tourists' | 'zones' | 'efir' | 'analytics' | 'roles' | 'system'>('dashboard');

  // Mock dashboard data
  const dashboardData = {
    tourists: { total: 1247, active: 892, alerts: 23 },
    zones: { safe: 45, restricted: 12, monitored: 8 },
    alerts: { critical: 3, moderate: 15, low: 45 },
    efirs: { pending: 7, approved: 156, drafts: 12 }
  };

  const getCardsByRole = () => {
    const baseCards = [
      {
        title: 'Live Alerts',
        icon: AlertTriangle,
        description: 'Real-time incident monitoring',
        data: `${dashboardData.alerts.critical} Critical`,
        color: 'text-emergency',
        action: 'View Feed',
        onClick: () => setCurrentView('alerts')
      },
      {
        title: 'Tourists',
        icon: Users,
        description: 'Active tourist tracking',
        data: `${dashboardData.tourists.active}/${dashboardData.tourists.total}`,
        color: 'text-primary',
        action: 'View Map',
        onClick: () => setCurrentView('tourists')
      },
      {
        title: 'Safety Zones',
        icon: MapPin,
        description: 'Zone management & monitoring',
        data: `${dashboardData.zones.safe} Safe, ${dashboardData.zones.restricted} Restricted`,
        color: 'text-success',
        action: 'Manage',
        onClick: () => setCurrentView('zones')
      }
    ];

    if (userRole === 'police' || userRole === 'admin') {
      baseCards.push({
        title: 'E-FIR System',
        icon: FileText,
        description: 'Digital FIR management',
        data: `${dashboardData.efirs.pending} Pending`,
        color: 'text-warning',
        action: 'Process',
        onClick: () => setCurrentView('efir')
      });
    }

    if (userRole === 'tourism' || userRole === 'admin') {
      baseCards.push({
        title: 'Analytics',
        icon: BarChart3,
        description: 'Tourism safety analytics',
        data: 'View Reports',
        color: 'text-secondary',
        action: 'Open',
        onClick: () => setCurrentView('analytics')
      });
    }

    if (userRole === 'admin') {
      baseCards.push(
        {
          title: 'Role Management',
          icon: UserCheck,
          description: 'User roles & permissions',
          data: 'Manage Access',
          color: 'text-accent',
          action: 'Configure',
          onClick: () => setCurrentView('roles')
        },
        {
          title: 'System Health',
          icon: Activity,
          description: 'API & socket monitoring',
          data: 'All Systems Online',
          color: 'text-success',
          action: 'Monitor',
          onClick: () => setCurrentView('system')
        }
      );
    }

    return baseCards;
  };

  const cards = getCardsByRole();

  if (currentView === 'alerts') {
    return <LiveAlerts onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'tourists') {
    return <TouristManagement onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'zones') {
    return <ZoneManagement onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'analytics') {
    return <AnalyticsDashboard onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'efir') {
    return <EFIRManagement onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'roles') {
    return <RoleManagement onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'system') {
    return <SystemHealth onBack={() => setCurrentView('dashboard')} />;
  }

  // Placeholder views for other sections
  if (currentView !== 'dashboard') {
    return (
      <div className="min-h-screen bg-background pt-20 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentView('dashboard')}
            className="mb-6"
          >
            ← Back to Dashboard
          </Button>
          <div className="bg-muted/20 rounded-lg p-12">
            <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2 capitalize">{currentView} Management</h2>
            <p className="text-muted-foreground">This section is under development.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Map Background */}
      <div className="fixed inset-0 pt-16 bg-muted/20">
        <InteractiveMap 
          center={{ lat: 28.6139, lng: 77.2090 }}
          zoom={11}
          showControls={true}
        />
      </div>

      {/* Dashboard Cards Overlay */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  {userRole === 'police' && 'Police Dashboard'}
                  {userRole === 'tourism' && 'Tourism Department'}
                  {userRole === 'admin' && 'System Administration'}
                </h1>
                <p className="text-muted-foreground">Welcome back, {auth.user?.name}</p>
              </div>
              
              {/* Live Alerts Panel Toggle */}
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="animate-pulse">
                  {dashboardData.alerts.critical} Critical
                </Badge>
                <Button variant="outline" size="sm" onClick={() => setCurrentView('alerts')}>
                  <Bell className="w-4 h-4 mr-2" />
                  Alerts
                </Button>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card key={index} className="bg-background/95 backdrop-blur-sm shadow-card hover:shadow-elevated transition-all duration-200 cursor-pointer" onClick={card.onClick}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${card.color}`} />
                        <span className="text-sm">{card.title}</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground">{card.description}</p>
                      <div className="text-lg font-semibold">{card.data}</div>
                      <Button size="sm" variant="outline" className="w-full" onClick={(e) => { e.stopPropagation(); card.onClick(); }}>
                        {card.action}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* System Status Bar */}
          <div className="mt-6">
            <Card className="bg-background/95 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                      <span className="text-sm">WebSocket Connected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success"></div>
                      <span className="text-sm">API Online</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-warning"></div>
                      <span className="text-sm">GPS Sync</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;