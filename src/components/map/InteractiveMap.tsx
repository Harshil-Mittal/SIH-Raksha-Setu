import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Shield, 
  AlertTriangle, 
  Users, 
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';

interface MapLocation {
  id: string;
  lat: number;
  lng: number;
  type: 'tourist' | 'safe_zone' | 'restricted_zone' | 'alert' | 'police_station';
  title: string;
  description?: string;
  status?: 'active' | 'inactive' | 'warning';
}

interface InteractiveMapProps {
  locations?: MapLocation[];
  center?: { lat: number; lng: number };
  zoom?: number;
  showControls?: boolean;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  locations = [], 
  center = { lat: 28.6139, lng: 77.2090 }, // Delhi coordinates
  zoom = 11,
  showControls = true 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [mapCenter, setMapCenter] = useState(center);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [mapLayer, setMapLayer] = useState<'standard' | 'satellite' | 'terrain'>('standard');

  // Mock locations data
  const mockLocations: MapLocation[] = [
    {
      id: '1',
      lat: 28.6562,
      lng: 77.2410,
      type: 'safe_zone',
      title: 'Red Fort Safe Zone',
      description: 'Tourist safe zone with 24/7 monitoring',
      status: 'active'
    },
    {
      id: '2',
      lat: 28.6129,
      lng: 77.2295,
      type: 'tourist',
      title: 'Tourist Group Alpha',
      description: '15 tourists from Japan',
      status: 'active'
    },
    {
      id: '3',
      lat: 28.6328,
      lng: 77.2200,
      type: 'alert',
      title: 'Traffic Congestion Alert',
      description: 'Heavy traffic reported in this area',
      status: 'warning'
    },
    {
      id: '4',
      lat: 28.5535,
      lng: 77.2588,
      type: 'restricted_zone',
      title: 'Restricted Area',
      description: 'Construction zone - avoid this area',
      status: 'active'
    },
    {
      id: '5',
      lat: 28.6506,
      lng: 77.2334,
      type: 'police_station',
      title: 'Chandni Chowk Police Station',
      description: 'Emergency services available',
      status: 'active'
    }
  ];

  const allLocations = [...locations, ...mockLocations];

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'tourist': return { icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'safe_zone': return { icon: Shield, color: 'text-green-600', bg: 'bg-green-100' };
      case 'restricted_zone': return { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' };
      case 'alert': return { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100' };
      case 'police_station': return { icon: Shield, color: 'text-blue-800', bg: 'bg-blue-200' };
      default: return { icon: MapPin, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return { text: 'Active', variant: 'default' as const };
      case 'warning': return { text: 'Warning', variant: 'destructive' as const };
      case 'inactive': return { text: 'Inactive', variant: 'secondary' as const };
      default: return { text: 'Unknown', variant: 'secondary' as const };
    }
  };

  const handleZoomIn = () => {
    setCurrentZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setCurrentZoom(prev => Math.max(prev - 1, 3));
  };

  const handleResetView = () => {
    setCurrentZoom(zoom);
    setMapCenter(center);
  };

  const handleLocationClick = (location: MapLocation) => {
    setSelectedLocation(location);
  };

  return (
    <div className="relative w-full h-full bg-muted/20 rounded-lg overflow-hidden">
      {/* Map Background */}
      <div 
        ref={mapRef}
        className="w-full h-full relative bg-gradient-to-br from-blue-50 to-green-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='M0 0h40v40H0V0zm10 10h20v20H10V10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {/* Location Markers */}
        {allLocations.map((location) => {
          const { icon: Icon, color, bg } = getLocationIcon(location.type);
          const relativeX = ((location.lng - (mapCenter.lng - 0.1)) / 0.2) * 100;
          const relativeY = ((mapCenter.lat + 0.1 - location.lat) / 0.2) * 100;
          
          // Only show markers that are within the visible area
          if (relativeX < 0 || relativeX > 100 || relativeY < 0 || relativeY > 100) {
            return null;
          }

          return (
            <div
              key={location.id}
              className={`absolute w-8 h-8 ${bg} ${color} rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-md z-10`}
              style={{
                left: `${relativeX}%`,
                top: `${relativeY}%`,
                transform: 'translate(-50%, -50%)',
                animation: location.status === 'warning' ? 'pulse 2s infinite' : 'none'
              }}
              onClick={() => handleLocationClick(location)}
            >
              <Icon className="w-4 h-4" />
            </div>
          );
        })}

        {/* Map Grid Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Center Crosshair */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-4 h-4 border-2 border-primary rounded-full opacity-50" />
        </div>
      </div>

      {/* Map Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <div className="bg-background/95 backdrop-blur-sm rounded-lg p-2 shadow-lg">
            <div className="flex flex-col gap-1">
              <Button variant="ghost" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleResetView}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="bg-background/95 backdrop-blur-sm rounded-lg p-2 shadow-lg">
            <Button variant="ghost" size="sm">
              <Layers className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
        <h4 className="font-medium mb-2 text-sm">Map Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <Shield className="w-2 h-2" />
            </div>
            <span>Safe Zones</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Users className="w-2 h-2" />
            </div>
            <span>Tourist Groups</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-2 h-2" />
            </div>
            <span>Restricted Areas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-2 h-2" />
            </div>
            <span>Active Alerts</span>
          </div>
        </div>
      </div>

      {/* Location Details Popup */}
      {selectedLocation && (
        <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg shadow-lg max-w-sm">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium">{selectedLocation.title}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedLocation(null)}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
              {selectedLocation.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedLocation.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <Badge variant={getStatusBadge(selectedLocation.status || 'unknown').variant}>
                  {getStatusBadge(selectedLocation.status || 'unknown').text}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Zoom Level Indicator */}
      <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg">
        <div className="text-xs text-muted-foreground">
          Zoom: {currentZoom}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;