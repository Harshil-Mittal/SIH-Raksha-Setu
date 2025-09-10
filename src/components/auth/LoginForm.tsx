import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { LoginCredentials, DEMO_ACCOUNTS } from '@/types/auth';
import { Eye, EyeOff, Shield, Users, UserCheck, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const roleIcons = {
  tourist: Users,
  police: Shield,
  tourism: UserCheck,
  admin: Settings,
};

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, auth } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(credentials);
    if (!success) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Try demo accounts.",
      });
    }
  };

  const handleDemoLogin = async (role: keyof typeof DEMO_ACCOUNTS) => {
    const demoCredentials = DEMO_ACCOUNTS[role];
    const success = await login(demoCredentials);
    if (success) {
      toast({
        title: "Demo Login Successful",
        description: `Logged in as ${role}`,
      });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-elevated">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to your RakshaSetu account
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
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
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-brand hover:opacity-90" 
            disabled={auth.isLoading}
          >
            {auth.isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Demo Accounts</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(DEMO_ACCOUNTS).map(([role, creds]) => {
            const Icon = roleIcons[role as keyof typeof roleIcons];
            return (
              <Button
                key={role}
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin(role as keyof typeof DEMO_ACCOUNTS)}
                className="flex items-center gap-2 text-xs"
                disabled={auth.isLoading}
              >
                <Icon className="w-3 h-3" />
                {role}
              </Button>
            );
          })}
        </div>
        
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Button variant="link" className="p-0 h-auto" onClick={onSwitchToSignup}>
            Sign up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;