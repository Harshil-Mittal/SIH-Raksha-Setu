import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Settings,
  Bell,
  Globe,
  Shield,
  Phone,
  Moon,
  Sun,
  User,
  MapPin,
  Database,
  Lock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
  const { auth } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [emergencyContact, setEmergencyContact] = useState('+91 1234567890');
  const [sosTimeout, setSosTimeout] = useState('30');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="w-4 h-4" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive safety alerts and updates</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Emergency Alerts</Label>
                  <p className="text-xs text-muted-foreground">Critical safety notifications</p>
                </div>
                <Switch checked={emergencyAlerts} onCheckedChange={setEmergencyAlerts} />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-4 h-4" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Location Sharing</Label>
                  <p className="text-xs text-muted-foreground">Share location for safety monitoring</p>
                </div>
                <Switch checked={locationSharing} onCheckedChange={setLocationSharing} />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">SOS Auto-call Timeout</Label>
                <Select value={sosTimeout} onValueChange={setSosTimeout}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="180">3 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact - Only for tourists */}
          {auth.user?.role === 'tourist' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Phone className="w-4 h-4" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Primary Emergency Number</Label>
                  <Input 
                    value={emergencyContact} 
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="+91 1234567890"
                  />
                </div>
                
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  Test Call
                </Button>
              </CardContent>
            </Card>
          )}

          {/* System Settings - Only for non-tourists */}
          {auth.user?.role !== 'tourist' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Database className="w-4 h-4" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Auto Backup</Label>
                    <p className="text-xs text-muted-foreground">Automatic data backup</p>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Debug Mode</Label>
                    <p className="text-xs text-muted-foreground">Enable system debugging</p>
                  </div>
                  <Switch checked={false} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Data Retention (days)</Label>
                  <Select defaultValue="90">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preferences */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-4 h-4" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी</SelectItem>
                    <SelectItem value="bn">বাংলা</SelectItem>
                    <SelectItem value="ta">தமிழ்</SelectItem>
                    <SelectItem value="te">తెలుగు</SelectItem>
                    <SelectItem value="gu">ગુજરાતી</SelectItem>
                    <SelectItem value="mr">मराठी</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Dark Mode</Label>
                  <p className="text-xs text-muted-foreground">Switch to dark theme</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {auth.user?.role === 'tourist' ? <MapPin className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Update Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Download Data
              </Button>
              {auth.user?.role !== 'tourist' && (
                <Button variant="outline" className="w-full justify-start">
                  System Logs
                </Button>
              )}
              <Separator />
              <Button variant="destructive" className="w-full justify-start">
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;