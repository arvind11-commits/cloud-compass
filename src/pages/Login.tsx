import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Cloud, Mail, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string) => boolean;
  onSignup: (email: string, password: string) => boolean;
}

const Login = ({ onLogin, onSignup }: LoginProps) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }

    if (password.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }

    const success = isSignup ? onSignup(email, password) : onLogin(email, password);
    
    if (success) {
      toast({ title: 'Success', description: isSignup ? 'Account created!' : 'Welcome back!' });
    } else {
      toast({ title: 'Error', description: 'Authentication failed', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md backdrop-blur-sm bg-card/80 border-border/50 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Cloud className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Cloud Computing Roadmap</CardTitle>
          <CardDescription>
            {isSignup ? 'Create an account to track your progress' : 'Sign in to continue your journey'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              {isSignup ? 'Create Account' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
            </span>{' '}
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-primary hover:underline font-medium"
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
          <p className="mt-4 text-xs text-center text-muted-foreground">
            This is a prototype using localStorage. Not for production use.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
