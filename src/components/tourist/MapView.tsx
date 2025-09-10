import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Shield, AlertTriangle, Phone, ArrowLeft } from 'lucide-react';

interface MapViewProps {
  onBack: () => void;
}

const MapView: React.FC<MapViewProps> = ({ onBack }) => {
  const nearbyPOIs = [
    { id: 1, name: 'Police Station', type: 'police', distance: '0.5 km', status: 'open' },
    { id: 2, name: 'Tourist Help Center', type: 'help', distance: '0.8 km', status: 'open' },
    { id: 3, name: 'Medical Center', type: 'medical', distance: '1.2 km', status: 'open' },
    { id: 4, name: 'Embassy Office', type: 'embassy', distance: '2.1 km', status: 'closed' }
  ];

  const activeAlerts = [
    { id: 1, message: 'Heavy traffic in Central Market', severity: 'low', time: '10 mins ago' },
    { id: 2, message: 'Pickpocketing reports near Railway Station', severity: 'medium', time: '25 mins ago' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-lg font-semibold">Map View</h1>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="relative h-64 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 m-4 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Your current location</p>
            <Badge className="mt-2">Safe Zone</Badge>
          </div>
        </div>
        
        {/* Mock location markers */}
        <div className="absolute top-4 left-4 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-8 right-6 w-3 h-3 bg-green-500 rounded-full"></div>
        <div className="absolute top-12 right-8 w-3 h-3 bg-red-500 rounded-full"></div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <Button className="flex items-center gap-2" variant="outline">
            <Navigation className="w-4 h-4" />
            Get Directions
          </Button>
          <Button className="flex items-center gap-2" variant="outline">
            <Phone className="w-4 h-4" />
            Emergency Call
          </Button>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="px-4 mb-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.severity === 'high' ? 'bg-red-500' :
                    alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nearby POIs */}
      <div className="px-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Nearby Help Centers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nearbyPOIs.map((poi) => (
                <div key={poi.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{poi.name}</p>
                    <p className="text-xs text-muted-foreground">{poi.distance}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={poi.status === 'open' ? 'default' : 'secondary'}>
                      {poi.status}
                    </Badge>
                    <Button size="sm" variant="outline">Navigate</Button>
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

export default MapView;