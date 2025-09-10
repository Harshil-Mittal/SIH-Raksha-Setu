import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { SignupData, UserRole } from '@/types/auth';
import { Shield, Users, UserCheck, Settings, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const getRoleOptions = (t: any): { value: UserRole; label: string; description: string; icon: React.ElementType }[] => [
  { value: 'tourist', label: t('signup.roles.tourist'), description: t('signup.roles.touristDesc'), icon: Users },
  { value: 'police', label: t('signup.roles.police'), description: t('signup.roles.policeDesc'), icon: Shield },
  { value: 'tourism', label: t('signup.roles.tourism'), description: t('signup.roles.tourismDesc'), icon: UserCheck },
  { value: 'admin', label: t('signup.roles.admin'), description: t('signup.roles.adminDesc'), icon: Settings },
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'as', name: 'অসমীয়া (Assamese)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'mni', name: 'মৈতৈলোন্ (Manipuri)' },
  { code: 'kha', name: 'Khasi' },
  { code: 'nsm', name: 'Nagamese' },
  { code: 'brx', name: 'बड़ो (Bodo)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
];

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    email: '',
    password: '',
    role: 'tourist',
    language: 'en',
    nationality: '',
  });
  const [touristDetails, setTouristDetails] = useState({
    confirmPassword: '',
    itinerary: '',
    emergencyContact: '',
    emergencyContactName: '',
    aadhaarNumber: '',
    passportNumber: '',
    expectedStayDuration: '',
    accommodationDetails: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, auth } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match for tourists
    if (formData.role === 'tourist' && formData.password !== touristDetails.confirmPassword) {
      toast({
        variant: "destructive",
        title: t('errors.passwordMismatch'),
        description: t('errors.passwordMismatch'),
      });
      return;
    }

    // Validate required fields for tourists
    if (formData.role === 'tourist') {
      if (!touristDetails.emergencyContact || !touristDetails.emergencyContactName) {
        toast({
          variant: "destructive",
          title: t('errors.required'),
          description: t('signup.tourist.emergencyContactRequired'),
        });
        return;
      }
    }
    
    const enhancedFormData = {
      ...formData,
      ...(formData.role === 'tourist' ? touristDetails : {}),
    };
    
    const success = await signup(enhancedFormData);
    if (success) {
      toast({
        title: t('signup.success'),
        description: t('signup.welcome'),
      });
    } else {
      toast({
        variant: "destructive",
        title: t('errors.loginFailed'),
        description: t('errors.networkError'),
      });
    }
  };

  const roleOptions = getRoleOptions(t);

  return (
    <Card className="w-full max-w-md shadow-elevated">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-2xl">{t('signup.title')}</CardTitle>
        <CardDescription>
          {t('signup.tagline')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('signup.name')}</Label>
            <Input
              id="name"
              placeholder={t('signup.namePlaceholder')}
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">{t('signup.email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('signup.emailPlaceholder')}
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">{t('signup.password')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {formData.role === 'tourist' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('signup.confirmPassword')}</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={touristDetails.confirmPassword}
                  onChange={(e) => setTouristDetails(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>{t('signup.role')}</Label>
            <Select value={formData.role} onValueChange={(role: UserRole) => setFormData(prev => ({ ...prev, role }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((role) => {
                  const Icon = role.icon;
                  return (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{role.label}</div>
                          <div className="text-xs text-muted-foreground">{role.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>{t('signup.language')}</Label>
            <Select value={formData.language} onValueChange={(language) => setFormData(prev => ({ ...prev, language }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {formData.role === 'tourist' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="nationality">{t('signup.nationality')}</Label>
                <Input
                  id="nationality"
                  placeholder={t('signup.nationalityPlaceholder')}
                  value={formData.nationality || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">{t('signup.tourist.emergencyContactName')}</Label>
                <Input
                  id="emergencyContactName"
                  placeholder={t('signup.tourist.emergencyContactNamePlaceholder')}
                  value={touristDetails.emergencyContactName}
                  onChange={(e) => setTouristDetails(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">{t('signup.tourist.emergencyContact')}</Label>
                <Input
                  id="emergencyContact"
                  placeholder={t('signup.tourist.emergencyContactPlaceholder')}
                  value={touristDetails.emergencyContact}
                  onChange={(e) => setTouristDetails(prev => ({ ...prev, emergencyContact: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aadhaarNumber">{t('signup.tourist.aadhaarNumber')}</Label>
                <Input
                  id="aadhaarNumber"
                  placeholder={t('signup.tourist.aadhaarPlaceholder')}
                  value={touristDetails.aadhaarNumber}
                  onChange={(e) => setTouristDetails(prev => ({ ...prev, aadhaarNumber: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passportNumber">{t('signup.tourist.passportNumber')}</Label>
                <Input
                  id="passportNumber"
                  placeholder={t('signup.tourist.passportPlaceholder')}
                  value={touristDetails.passportNumber}
                  onChange={(e) => setTouristDetails(prev => ({ ...prev, passportNumber: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedStayDuration">{t('signup.tourist.expectedStayDuration')}</Label>
                <Input
                  id="expectedStayDuration"
                  placeholder={t('signup.tourist.expectedStayPlaceholder')}
                  value={touristDetails.expectedStayDuration}
                  onChange={(e) => setTouristDetails(prev => ({ ...prev, expectedStayDuration: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accommodationDetails">{t('signup.tourist.accommodationDetails')}</Label>
                <Input
                  id="accommodationDetails"
                  placeholder={t('signup.tourist.accommodationPlaceholder')}
                  value={touristDetails.accommodationDetails}
                  onChange={(e) => setTouristDetails(prev => ({ ...prev, accommodationDetails: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="itinerary">{t('signup.tourist.itinerary')}</Label>
                <Textarea
                  id="itinerary"
                  placeholder={t('signup.tourist.itineraryPlaceholder')}
                  value={touristDetails.itinerary}
                  onChange={(e) => setTouristDetails(prev => ({ ...prev, itinerary: e.target.value }))}
                  rows={3}
                />
              </div>
            </>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-brand hover:opacity-90" 
            disabled={auth.isLoading}
          >
            {auth.isLoading ? t('signup.creating') : t('signup.createAccount')}
          </Button>
        </form>
        
        <div className="text-center text-sm">
          <span className="text-muted-foreground">{t('signup.haveAccount')} </span>
          <Button variant="link" className="p-0 h-auto" onClick={onSwitchToLogin}>
            {t('login.login')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignupForm;