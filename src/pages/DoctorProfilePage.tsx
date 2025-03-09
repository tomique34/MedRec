import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Stethoscope, User, Mail, Phone, Building, MapPin, Award, KeyRound, Save, ArrowLeft, AlertCircle, CheckCircle, Settings } from 'lucide-react';
import { t, getCurrentLanguage } from '../lib/i18n';
import { LanguageSelector } from '../components/LanguageSelector';
import { DoctorProfile, getDoctorProfile, saveDoctorProfile } from '../lib/types';

const DoctorProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<DoctorProfile>(getDoctorProfile());
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
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPasswordChangeVisible, setIsPasswordChangeVisible] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');
    
    if (!isAuthenticated || userRole !== 'doctor') {
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Simple validation
    if (!profile.username || !profile.email) {
      setError('Username and email are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Save profile
    saveDoctorProfile(profile);
    setSuccess('Profile updated successfully');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Simple validation
    if (!currentPassword) {
      setError('Current password is required');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError('New password and confirmation are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // In a real app, we would verify the current password and update it
    // For this demo, we'll just show a success message
    setSuccess('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsPasswordChangeVisible(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">MedRec</h1>
              <span className="ml-2 bg-blue-100 text-primary px-2 py-0.5 rounded text-sm font-medium">
                {t('doctor.title')}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <Button 
                variant="ghost" 
                className="flex items-center gap-1"
                onClick={() => navigate('/doctor')}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Doctor Profile</h1>
          
          {error && (
            <div className="mb-6 flex items-center p-4 bg-destructive/10 rounded-md text-destructive">
              <AlertCircle className="mr-2 flex-shrink-0" size={20} />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mb-6 flex items-center p-4 bg-green-100 rounded-md text-green-700">
              <CheckCircle className="mr-2 flex-shrink-0" size={20} />
              <span>{success}</span>
            </div>
          )}
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium">
                      Username
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <User className="h-4 w-4" />
                      </span>
                      <Input
                        id="username"
                        name="username"
                        value={profile.username}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        placeholder="johndoe"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <Mail className="h-4 w-4" />
                      </span>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Title
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <Award className="h-4 w-4" />
                      </span>
                      <Input
                        id="title"
                        name="title"
                        value={profile.title}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        placeholder="MD, Cardiologist"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="contactPhone" className="text-sm font-medium">
                      Contact Phone
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <Phone className="h-4 w-4" />
                      </span>
                      <Input
                        id="contactPhone"
                        name="contactPhone"
                        value={profile.contactPhone}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="ambulanceName" className="text-sm font-medium">
                    Ambulance / Practice Name
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <Building className="h-4 w-4" />
                    </span>
                    <Input
                      id="ambulanceName"
                      name="ambulanceName"
                      value={profile.ambulanceName}
                      onChange={handleInputChange}
                      className="rounded-l-none"
                      placeholder="City Medical Center"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="ambulanceAddress" className="text-sm font-medium">
                    Ambulance / Practice Address
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <Input
                      id="ambulanceAddress"
                      name="ambulanceAddress"
                      value={profile.ambulanceAddress}
                      onChange={handleInputChange}
                      className="rounded-l-none"
                      placeholder="123 Medical Ave, Suite 456, City, State 12345"
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button type="submit" className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                Password
              </CardTitle>
              <CardDescription>
                Change your password
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {!isPasswordChangeVisible ? (
                <Button 
                  variant="outline" 
                  onClick={() => setIsPasswordChangeVisible(true)}
                >
                  Change Password
                </Button>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="currentPassword" className="text-sm font-medium">
                      Current Password
                    </label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="text-sm font-medium">
                      New Password
                    </label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm New Password
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button type="submit">Update Password</Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsPasswordChangeVisible(false);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="container mx-auto mt-8 py-4 text-center text-sm text-muted-foreground border-t">
        <p>MedRec Doctor Dashboard • v1.0 • © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default DoctorProfilePage;
