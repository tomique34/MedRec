import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Stethoscope, AlertCircle } from 'lucide-react';
import { LanguageSelector } from '../components/LanguageSelector';
import { t, getCurrentLanguage } from '../lib/i18n';
import { authenticateUser } from '../lib/auth';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Force re-render when language changes
  const [language, setLanguage] = useState(getCurrentLanguage());
  
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(getCurrentLanguage());
    };
    
    window.addEventListener('languagechange', handleLanguageChange);
    return () => {
      window.removeEventListener('languagechange', handleLanguageChange);
    };
  }, []);

  // Authentication using our secure auth system
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    // Authenticate user with secure credentials
    const authResult = authenticateUser(username, password);
    
    if (authResult.authenticated) {
      // Store authentication state and user role
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', authResult.role || '');
      
      // Navigate to the appropriate dashboard
      if (authResult.role === 'admin') {
        navigate('/admin');
      } else if (authResult.role === 'doctor') {
        navigate('/doctor');
      }
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSelector />
      </div>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Stethoscope className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">MedRec</CardTitle>
          <CardDescription>
            {t('auth.signIn')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded mb-4 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  {t('auth.username')}
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={`${t('auth.username')}...`}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  {t('auth.password')}
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={`${t('auth.password')}...`}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    {t('auth.rememberMe')}
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="text-primary hover:text-primary/80">
                    {t('auth.forgotPassword')}
                  </a>
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                {t('auth.signIn')}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col">
          <div className="mt-2 text-center text-sm text-muted-foreground">
            <p>Please enter your credentials to access the system</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
