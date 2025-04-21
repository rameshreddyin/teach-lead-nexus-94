
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('teacher@school.edu');
  const [password, setPassword] = useState('welcome123');
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimer, setBlockTimer] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Rate limiting effect
  useEffect(() => {
    const attemptsFromStorage = sessionStorage.getItem('login_attempts');
    const lastAttemptTime = sessionStorage.getItem('last_attempt_time');
    const blockedUntil = sessionStorage.getItem('blocked_until');
    
    if (attemptsFromStorage) {
      setLoginAttempts(parseInt(attemptsFromStorage, 10));
    }
    
    if (blockedUntil) {
      const blocked = parseInt(blockedUntil, 10);
      const now = Date.now();
      
      if (blocked > now) {
        setIsBlocked(true);
        setBlockTimer(Math.ceil((blocked - now) / 1000));
      } else {
        sessionStorage.removeItem('blocked_until');
        setIsBlocked(false);
      }
    }
    
    // Reset attempts after 30 minutes
    if (lastAttemptTime) {
      const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
      if (parseInt(lastAttemptTime, 10) < thirtyMinutesAgo) {
        sessionStorage.removeItem('login_attempts');
        sessionStorage.removeItem('last_attempt_time');
        setLoginAttempts(0);
      }
    }
  }, []);
  
  // Timer countdown effect
  useEffect(() => {
    let interval: number | undefined;
    
    if (isBlocked && blockTimer > 0) {
      interval = window.setInterval(() => {
        setBlockTimer(prev => {
          if (prev <= 1) {
            setIsBlocked(false);
            sessionStorage.removeItem('blocked_until');
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBlocked, blockTimer]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const recordLoginAttempt = () => {
    const attempts = loginAttempts + 1;
    setLoginAttempts(attempts);
    sessionStorage.setItem('login_attempts', attempts.toString());
    sessionStorage.setItem('last_attempt_time', Date.now().toString());
    
    // Implement progressive blocking
    if (attempts >= 5) {
      const blockDuration = Math.min(Math.pow(2, attempts - 5), 30) * 60 * 1000; // Max 30 minutes
      const blockedUntil = Date.now() + blockDuration;
      sessionStorage.setItem('blocked_until', blockedUntil.toString());
      setIsBlocked(true);
      setBlockTimer(blockDuration / 1000);
      
      toast({
        title: "Too many attempts",
        description: `Your account is locked for ${Math.ceil(blockDuration / 60000)} minutes due to multiple failed login attempts.`,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if rate limited
    if (isBlocked) {
      toast({
        title: "Access blocked",
        description: `Please try again in ${blockTimer} seconds.`,
        variant: "destructive",
      });
      return;
    }
    
    // Validate inputs before submitting
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    if (!validatePassword(password)) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      await login(email, password);
      // Reset login attempts on successful login
      sessionStorage.removeItem('login_attempts');
      sessionStorage.removeItem('last_attempt_time');
      navigate('/');
    } catch (error) {
      recordLoginAttempt();
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = () => {
    setEmail('teacher@school.edu');
    setPassword('welcome123');
  };

  // Sanitize input to prevent XSS
  const sanitizeInput = (input: string): string => {
    return input.trim();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-app-lightGray">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Teacher Lead Nexus</CardTitle>
          <CardDescription>
            Sign in to manage your student leads
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@school.edu"
                value={email}
                onChange={(e) => setEmail(sanitizeInput(e.target.value))}
                required
                className="h-12"
                aria-invalid={!validateEmail(email) && email !== ""}
                disabled={isBlocked}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-app-mediumGray hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(sanitizeInput(e.target.value))}
                required
                className="h-12"
                aria-invalid={!validatePassword(password) && password !== ""}
                disabled={isBlocked}
              />
            </div>
            {isBlocked && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
                Too many login attempts. Please try again in {blockTimer} seconds.
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              type="submit" 
              className="w-full h-12 text-base bg-app-black"
              disabled={isLoading || isBlocked}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              className="w-full h-12 text-base"
              onClick={handleQuickLogin}
              disabled={isBlocked}
            >
              Quick Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
