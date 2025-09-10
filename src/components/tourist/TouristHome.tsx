import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  MapPin, 
  AlertTriangle, 
  Calendar, 
  Shield,
  Phone,
  Clock,
  Plus
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { blockchainService } from '@/services/blockchainService';
import { useTranslation } from '@/hooks/useTranslation';
import MapView from './MapView';
import TripsView from './TripsView';

const TouristHome: React.FC = () => {
  const { auth, updateProfile } = useAuth();
  const { tTourist, tCommon, tSOS } = useTranslation();
  const [currentView, setCurrentView] = useState<'home' | 'map' | 'trips'>('home');
  const [isCreatingDigitalID, setIsCreatingDigitalID] = useState(false);
  const safetyScore = 85; // Mock safety score
  const tripEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

  const getSafetyColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-emergency';
  };

  const getSafetyBadge = (score: number) => {
    if (score >= 80) return { text: 'Safe', variant: 'default' as const, color: 'bg-success' };
    if (score >= 60) return { text: 'Caution', variant: 'secondary' as const, color: 'bg-warning' };
    return { text: 'Alert', variant: 'destructive' as const, color: 'bg-emergency' };
  };

  const safetyBadge = getSafetyBadge(safetyScore);

  const handleCreateDigitalID = async () => {
    if (!auth.user) return;
    
    setIsCreatingDigitalID(true);
    try {
      // First generate a wallet
      const walletResponse = await blockchainService.generateWallet();
      
      if (walletResponse.success && walletResponse.data) {
        // Create digital ID with the generated wallet
        const digitalIDResponse = await blockchainService.createDigitalID({
          userId: auth.user.id,
          name: auth.user.name,
          email: auth.user.email,
          role: auth.user.role,
          walletAddress: walletResponse.data.address
        });
        
        if (digitalIDResponse.success && digitalIDResponse.data) {
          // Update user profile with digital ID and wallet info
          updateProfile({
            digitalId: digitalIDResponse.data.id,
            walletAddress: walletResponse.data.address,
            walletMnemonic: walletResponse.data.mnemonic
          });
          
          console.log('✅ Digital ID created successfully:', digitalIDResponse.data.id);
        } else {
          console.error('❌ Digital ID creation failed:', digitalIDResponse.error);
          alert('Failed to create digital ID. Please try again.');
        }
      } else {
        console.error('❌ Wallet generation failed:', walletResponse.error);
        alert('Failed to generate wallet. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error creating digital ID:', error);
      alert('An error occurred while creating your digital ID. Please try again.');
    } finally {
      setIsCreatingDigitalID(false);
    }
  };

  const handleSOSClick = () => {
    // In a real app, this would trigger emergency services
    alert('SOS Alert Sent! Emergency services have been notified.');
  };

  const handleEmergencyCall = () => {
    // In a real app, this would initiate a phone call
    window.open('tel:+911234567890');
  };

  // Auto-create digital ID for existing users who don't have one
  useEffect(() => {
    if (auth.user && !auth.user.digitalId && !isCreatingDigitalID) {
      // Small delay to let the component render first
      const timer = setTimeout(() => {
        handleCreateDigitalID();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [auth.user?.id, isCreatingDigitalID]); // Include isCreatingDigitalID in dependencies

  if (currentView === 'map') {
    return <MapView onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'trips') {
    return <TripsView onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-24">
      <div className="max-w-md mx-auto px-4 space-y-4">
        {/* Welcome Card */}
        <Card className="bg-gradient-brand text-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{tTourist('home')}</h2>
                <p className="text-sm opacity-90">{auth.user?.name}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{safetyScore}%</div>
                <div className="text-sm opacity-90">{tTourist('safetyScore')}</div>
              </div>
              <Badge className={`${safetyBadge.color} text-white`}>
                {safetyBadge.text}
              </Badge>
            </div>
            <Progress value={safetyScore} className="mt-3 bg-white/20" />
          </CardContent>
        </Card>

        {/* Digital ID Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              {tTourist('digitalId')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auth.user?.digitalId ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono text-sm break-all">{auth.user.digitalId}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        Valid till {tripEndDate.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="w-16 h-16 bg-gradient-brand rounded-lg flex items-center justify-center">
                      <QrCode className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  {auth.user.walletAddress && (
                    <div className="pt-2 border-t">
                      <div className="text-xs text-muted-foreground">Wallet Address:</div>
                      <div className="font-mono text-xs break-all">{auth.user.walletAddress}</div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-sm text-muted-foreground mb-3">No Digital ID found</div>
                  <Button 
                    onClick={handleCreateDigitalID}
                    disabled={isCreatingDigitalID}
                    className="w-full"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {isCreatingDigitalID ? tCommon('loading') : 'Create Digital ID'}
                  </Button>
                  <div className="text-xs text-muted-foreground mt-2">
                    This will generate a blockchain wallet and digital identity
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('map')}>
            <CardContent className="p-4 text-center">
              <MapPin className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">{tTourist('map')}</div>
              <div className="text-xs text-muted-foreground">Safe zones & alerts</div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('trips')}>
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">{tTourist('trips')}</div>
              <div className="text-xs text-muted-foreground">Itinerary & warnings</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Alerts */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {tTourist('alerts')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-warning-amber mt-2"></div>
                <div className="flex-1">
                  <div className="text-sm">Area Advisory</div>
                  <div className="text-xs text-muted-foreground">High tourist activity in Central Market area</div>
                  <div className="text-xs text-muted-foreground">2 hours ago</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-safety-green mt-2"></div>
                <div className="flex-1">
                  <div className="text-sm">Zone Update</div>
                  <div className="text-xs text-muted-foreground">Palace area marked as safe zone</div>
                  <div className="text-xs text-muted-foreground">1 day ago</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emergency" />
                <div>
                  <div className="text-sm font-medium">Emergency Contact</div>
                  <div className="text-xs text-muted-foreground">Tourist Helpline</div>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={handleEmergencyCall}>Call Now</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed SOS Button */}
      <div className="fixed bottom-6 right-6">
        <Button 
          size="lg" 
          className="w-16 h-16 rounded-full bg-emergency hover:bg-emergency/90 shadow-elevated animate-pulse-emergency"
          onClick={handleSOSClick}
        >
          <div className="text-center">
            <div className="text-lg font-bold">{tSOS('button')}</div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default TouristHome;