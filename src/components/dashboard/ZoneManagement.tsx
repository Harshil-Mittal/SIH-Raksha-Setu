import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  MapPin, 
  Shield, 
  AlertTriangle, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Zone {
  id: string;
  name: string;
  type: 'safe' | 'restricted' | 'alert';
  coordinates: Array<{ lat: number; lng: number }>;
  radius?: number;
  description: string;
  activeAlerts: number;
  touristsInside: number;
  lastUpdated: string;
  createdBy: string;
  status: 'active' | 'inactive';
}

interface ZoneManagementProps {
  onBack: () => void;
}

const ZoneManagement: React.FC<ZoneManagementProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock data
  const zones: Zone[] = [
    {
      id: '1',
      name: 'Central Tourist District',
      type: 'safe',
      coordinates: [
        { lat: 26.9124, lng: 75.7873 },
        { lat: 26.9200, lng: 75.7900 },
        { lat: 26.9150, lng: 75.8000 },
        { lat: 26.9080, lng: 75.7950 }
      ],
      description: 'Main tourist area with high security presence',
      activeAlerts: 0,
      touristsInside: 45,
      lastUpdated: '2 hours ago',
      createdBy: 'Admin Team',
      status: 'active'
    },
    {
      id: '2',
      name: 'Construction Area - East Wing',
      type: 'restricted',
      coordinates: [
        { lat: 26.9250, lng: 75.8100 },
        { lat: 26.9280, lng: 75.8150 },
        { lat: 26.9220, lng: 75.8200 },
        { lat: 26.9190, lng: 75.8120 }
      ],
      description: 'Ongoing construction work - restricted access',
      activeAlerts: 2,
      touristsInside: 0,
      lastUpdated: '30 mins ago',
      createdBy: 'Security Chief',
      status: 'active'
    },
    {
      id: '3',
      name: 'Market Square - High Alert',
      type: 'alert',
      coordinates: [
        { lat: 26.9180, lng: 75.7750 },
        { lat: 26.9220, lng: 75.7780 },
        { lat: 26.9200, lng: 75.7850 },
        { lat: 26.9160, lng: 75.7820 }
      ],
      description: 'Crowded market area requiring extra vigilance',
      activeAlerts: 1,
      touristsInside: 23,
      lastUpdated: '1 hour ago',
      createdBy: 'Field Officer',
      status: 'active'
    }
  ];

  const filteredZones = zones.filter(zone => {
    const matchesSearch = zone.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || zone.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getZoneTypeColor = (type: Zone['type']) => {
    switch (type) {
      case 'safe': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'restricted': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'alert': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getZoneIcon = (type: Zone['type']) => {
    switch (type) {
      case 'safe': return <Shield className="w-4 h-4" />;
      case 'restricted': return <AlertTriangle className="w-4 h-4" />;
      case 'alert': return <AlertTriangle className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
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
            <h1 className="text-2xl font-bold">{t('zones.title')}</h1>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {t('zones.draw')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Zone</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zoneName">Zone Name</Label>
                    <Input id="zoneName" placeholder="Enter zone name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zoneType">Zone Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="safe">{t('zones.safe')}</SelectItem>
                        <SelectItem value="restricted">{t('zones.restricted')}</SelectItem>
                        <SelectItem value="alert">Alert Zone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Zone description..." />
                </div>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Map integration for zone drawing</p>
                    <p className="text-xs text-muted-foreground">Click and drag to define zone boundaries</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>
                    {t('zones.save')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search zones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              <SelectItem value="safe">{t('zones.safe')}</SelectItem>
              <SelectItem value="restricted">{t('zones.restricted')}</SelectItem>
              <SelectItem value="alert">Alert Zones</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {filteredZones.map((zone) => (
              <Card key={zone.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getZoneTypeColor(zone.type)}>
                          {getZoneIcon(zone.type)}
                          <span className="ml-1 capitalize">{zone.type}</span>
                        </Badge>
                        <h3 className="text-lg font-semibold">{zone.name}</h3>
                        <Badge variant={zone.status === 'active' ? 'default' : 'secondary'}>
                          {zone.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{zone.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                          <span className="text-sm">
                            <span className="font-medium">{zone.activeAlerts}</span> Active Alerts
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">
                            <span className="font-medium">{zone.touristsInside}</span> Tourists Inside
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">Updated {zone.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => setSelectedZone(zone)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="map">
            <Card>
              <CardContent className="p-6">
                <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 mx-auto text-primary mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Interactive Zone Map</h3>
                    <p className="text-muted-foreground">Map integration showing all zones</p>
                  </div>
                  
                  {/* Mock zone markers */}
                  <div className="absolute top-8 left-12 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white shadow-lg"></div>
                  <div className="absolute bottom-16 right-16 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white shadow-lg"></div>
                  <div className="absolute top-20 right-20 w-4 h-4 bg-yellow-500 rounded-full animate-pulse border-2 border-white shadow-lg"></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Zone Details Dialog */}
      {selectedZone && (
        <Dialog open={!!selectedZone} onOpenChange={() => setSelectedZone(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getZoneIcon(selectedZone.type)}
                {selectedZone.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getZoneTypeColor(selectedZone.type)}>
                  {selectedZone.type}
                </Badge>
                <Badge variant={selectedZone.status === 'active' ? 'default' : 'secondary'}>
                  {selectedZone.status}
                </Badge>
              </div>
              
              <p className="text-muted-foreground">{selectedZone.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Alerts:</span>
                    <span className="font-medium">{selectedZone.activeAlerts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tourists Inside:</span>
                    <span className="font-medium">{selectedZone.touristsInside}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Created By:</span>
                    <span className="font-medium">{selectedZone.createdBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last Updated:</span>
                    <span className="font-medium">{selectedZone.lastUpdated}</span>
                  </div>
                </div>
              </div>
              
              <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Zone boundary visualization</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedZone(null)}>
                  {t('common.close')}
                </Button>
                <Button>
                  {t('zones.edit')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ZoneManagement;