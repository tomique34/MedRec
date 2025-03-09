import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Stethoscope, Settings, Users, LogOut, CheckCircle, Plus, Edit, Key, X } from 'lucide-react';
import { t, getCurrentLanguage } from '../lib/i18n';
import { LanguageSelector } from '../components/LanguageSelector';
import { DoctorProfile } from '../lib/types';

const AdminDashboard: React.FC = () => {
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
  
  // States for doctor editing and password reset
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  
  // Doctor management state
  const [doctors, setDoctors] = useState<DoctorProfile[]>([
    { 
      id: 1, 
      username: 'jsmith',
      email: 'john.smith@example.com', 
      firstName: 'John',
      lastName: 'Smith',
      title: 'MD',
      specialization: 'Cardiology',
      ambulanceName: 'City Medical Center',
      ambulanceAddress: '123 Medical Ave, Suite 100',
      contactPhone: '+1 (555) 123-4567'
    },
    { 
      id: 2, 
      username: 'sjohnson',
      email: 'sarah.johnson@example.com', 
      firstName: 'Sarah',
      lastName: 'Johnson',
      title: 'MD',
      specialization: 'Neurology',
      ambulanceName: 'Neurology Associates',
      ambulanceAddress: '456 Brain St, Suite 200',
      contactPhone: '+1 (555) 987-6543'
    },
  ]);
  
  const [newDoctor, setNewDoctor] = useState<{
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    title: string;
    specialization: string;
    password: string;
    webhookUrl: string;
    apiKey: string;
    authType: 'none' | 'basic' | 'bearer' | 'oauth';
    authConfig: {
      username: string;
      password: string;
      bearerToken: string;
      oauthClientId: string;
      oauthClientSecret: string;
      oauthTokenUrl: string;
    };
  }>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    title: '',
    specialization: '',
    password: '',
    webhookUrl: '',
    apiKey: '',
    authType: 'none',
    authConfig: {
      username: '',
      password: '',
      bearerToken: '',
      oauthClientId: '',
      oauthClientSecret: '',
      oauthTokenUrl: ''
    }
  });
  
  const [addDoctorSuccess, setAddDoctorSuccess] = useState(false);

  // Handle opening the edit modal for a doctor
  const handleEditDoctor = (doctor: DoctorProfile) => {
    setSelectedDoctor(doctor);
    setIsEditModalOpen(true);
  };

  // Handle opening the password reset modal for a doctor
  const handleResetPassword = (doctor: DoctorProfile) => {
    setSelectedDoctor(doctor);
    setIsPasswordResetModalOpen(true);
    setNewPassword('');
    setConfirmPassword('');
  };

  // Handle saving edited doctor information
  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    
    // Update the doctor in the doctors array
    setDoctors(doctors.map(d => d.id === selectedDoctor.id ? selectedDoctor : d));
    
    // Show success message and close modal
    setEditSuccess(true);
    setTimeout(() => {
      setEditSuccess(false);
      setIsEditModalOpen(false);
    }, 2000);
  };

  // Handle password reset
  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    
    // In a real app, this would call an API to reset the password
    console.log(`Resetting password for doctor ${selectedDoctor?.id} to ${newPassword}`);
    
    // Show success message and close modal
    setPasswordResetSuccess(true);
    setTimeout(() => {
      setPasswordResetSuccess(false);
      setIsPasswordResetModalOpen(false);
    }, 2000);
  };

  // Handle adding a new doctor
  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new doctor profile
    const newDoctorProfile: DoctorProfile = {
      id: doctors.length + 1,
      username: newDoctor.username,
      email: newDoctor.email,
      firstName: newDoctor.firstName,
      lastName: newDoctor.lastName,
      title: newDoctor.title,
      specialization: newDoctor.specialization,
      ambulanceName: '',
      ambulanceAddress: '',
      contactPhone: '',
      webhookUrl: newDoctor.webhookUrl,
      apiKey: newDoctor.apiKey,
      authType: newDoctor.authType,
      authConfig: newDoctor.authConfig
    };
    
    // Add the new doctor to the doctors array
    setDoctors([...doctors, newDoctorProfile]);
    
    // Reset the form
    setNewDoctor({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      title: '',
      specialization: '',
      password: '',
      webhookUrl: '',
      apiKey: '',
      authType: 'none',
      authConfig: {
        username: '',
        password: '',
        bearerToken: '',
        oauthClientId: '',
        oauthClientSecret: '',
        oauthTokenUrl: ''
      }
    });
    
    // Show success message
    setAddDoctorSuccess(true);
    setTimeout(() => setAddDoctorSuccess(false), 3000);
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
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <Link 
                to="/" 
                className="flex items-center text-gray-600 hover:text-gray-900"
                onClick={() => localStorage.removeItem('isAuthenticated')}
              >
                <LogOut className="h-5 w-5 mr-1" />
                <span>{t('auth.signOut')}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex mb-6 border-b">
          <div className={`px-4 py-2 font-medium flex items-center text-primary border-b-2 border-primary`}>
            <Users className="h-5 w-5 mr-2" />
            {t('admin.doctorManagement')}
          </div>
        </div>

        {/* Doctor Management Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.addDoctor')}</CardTitle>
              <CardDescription>
                {t('admin.addDoctorDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {addDoctorSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {t('admin.doctorAdded')}
                </div>
              )}

              <form onSubmit={handleAddDoctor}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      {t('common.firstName')}
                    </label>
                    <Input
                      id="firstName"
                      type="text"
                      value={newDoctor.firstName}
                      onChange={(e) => setNewDoctor({ ...newDoctor, firstName: e.target.value })}
                      placeholder="John"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      {t('common.lastName')}
                    </label>
                    <Input
                      id="lastName"
                      type="text"
                      value={newDoctor.lastName}
                      onChange={(e) => setNewDoctor({ ...newDoctor, lastName: e.target.value })}
                      placeholder="Smith"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      {t('admin.username')}
                    </label>
                    <Input
                      id="username"
                      type="text"
                      value={newDoctor.username}
                      onChange={(e) => setNewDoctor({ ...newDoctor, username: e.target.value })}
                      placeholder="jsmith"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      {t('admin.email')}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={newDoctor.email}
                      onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                      placeholder="john.smith@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      {t('doctor.title')}
                    </label>
                    <Input
                      id="title"
                      type="text"
                      value={newDoctor.title}
                      onChange={(e) => setNewDoctor({ ...newDoctor, title: e.target.value })}
                      placeholder="MD"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                      {t('admin.specialization')}
                    </label>
                    <Input
                      id="specialization"
                      type="text"
                      value={newDoctor.specialization}
                      onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                      placeholder="Cardiology"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      {t('admin.password')}
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={newDoctor.password}
                      onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
                      placeholder="Set initial password"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 border-t pt-4">
                  <h3 className="text-lg font-medium mb-4">Webhook Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-700">
                        Webhook URL
                      </label>
                      <Input
                        id="webhookUrl"
                        type="url"
                        value={newDoctor.webhookUrl}
                        onChange={(e) => setNewDoctor({ ...newDoctor, webhookUrl: e.target.value })}
                        placeholder="https://example.com/webhook"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                        API Key
                      </label>
                      <Input
                        id="apiKey"
                        type="text"
                        value={newDoctor.apiKey}
                        onChange={(e) => setNewDoctor({ ...newDoctor, apiKey: e.target.value })}
                        placeholder="Optional API key"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Authentication Type
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="authNone"
                            name="authType"
                            value="none"
                            checked={newDoctor.authType === 'none'}
                            onChange={() => setNewDoctor({ ...newDoctor, authType: 'none' })}
                            className="mr-2"
                          />
                          <label htmlFor="authNone">None</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="authBasic"
                            name="authType"
                            value="basic"
                            checked={newDoctor.authType === 'basic'}
                            onChange={() => setNewDoctor({ ...newDoctor, authType: 'basic' })}
                            className="mr-2"
                          />
                          <label htmlFor="authBasic">Basic</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="authBearer"
                            name="authType"
                            value="bearer"
                            checked={newDoctor.authType === 'bearer'}
                            onChange={() => setNewDoctor({ ...newDoctor, authType: 'bearer' })}
                            className="mr-2"
                          />
                          <label htmlFor="authBearer">Bearer</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="authOAuth"
                            name="authType"
                            value="oauth"
                            checked={newDoctor.authType === 'oauth'}
                            onChange={() => setNewDoctor({ ...newDoctor, authType: 'oauth' })}
                            className="mr-2"
                          />
                          <label htmlFor="authOAuth">OAuth</label>
                        </div>
                      </div>
                    </div>

                    {newDoctor.authType === 'basic' && (
                      <>
                        <div className="space-y-2">
                          <label htmlFor="authUsername" className="block text-sm font-medium text-gray-700">
                            Username
                          </label>
                          <Input
                            id="authUsername"
                            type="text"
                            value={newDoctor.authConfig.username}
                            onChange={(e) => setNewDoctor({
                              ...newDoctor,
                              authConfig: { ...newDoctor.authConfig, username: e.target.value }
                            })}
                            placeholder="Basic Auth Username"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="authPassword" className="block text-sm font-medium text-gray-700">
                            Password
                          </label>
                          <Input
                            id="authPassword"
                            type="password"
                            value={newDoctor.authConfig.password}
                            onChange={(e) => setNewDoctor({
                              ...newDoctor,
                              authConfig: { ...newDoctor.authConfig, password: e.target.value }
                            })}
                            placeholder="Basic Auth Password"
                          />
                        </div>
                      </>
                    )}

                    {newDoctor.authType === 'bearer' && (
                      <div className="space-y-2 md:col-span-2">
                        <label htmlFor="bearerToken" className="block text-sm font-medium text-gray-700">
                          Bearer Token
                        </label>
                        <Input
                          id="bearerToken"
                          type="text"
                          value={newDoctor.authConfig.bearerToken}
                          onChange={(e) => setNewDoctor({
                            ...newDoctor,
                            authConfig: { ...newDoctor.authConfig, bearerToken: e.target.value }
                          })}
                          placeholder="Bearer Token"
                        />
                      </div>
                    )}

                    {newDoctor.authType === 'oauth' && (
                      <>
                        <div className="space-y-2">
                          <label htmlFor="oauthClientId" className="block text-sm font-medium text-gray-700">
                            Client ID
                          </label>
                          <Input
                            id="oauthClientId"
                            type="text"
                            value={newDoctor.authConfig.oauthClientId}
                            onChange={(e) => setNewDoctor({
                              ...newDoctor,
                              authConfig: { ...newDoctor.authConfig, oauthClientId: e.target.value }
                            })}
                            placeholder="OAuth Client ID"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="oauthClientSecret" className="block text-sm font-medium text-gray-700">
                            Client Secret
                          </label>
                          <Input
                            id="oauthClientSecret"
                            type="password"
                            value={newDoctor.authConfig.oauthClientSecret}
                            onChange={(e) => setNewDoctor({
                              ...newDoctor,
                              authConfig: { ...newDoctor.authConfig, oauthClientSecret: e.target.value }
                            })}
                            placeholder="OAuth Client Secret"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label htmlFor="oauthTokenUrl" className="block text-sm font-medium text-gray-700">
                            Token URL
                          </label>
                          <Input
                            id="oauthTokenUrl"
                            type="url"
                            value={newDoctor.authConfig.oauthTokenUrl}
                            onChange={(e) => setNewDoctor({
                              ...newDoctor,
                              authConfig: { ...newDoctor.authConfig, oauthTokenUrl: e.target.value }
                            })}
                            placeholder="https://example.com/oauth/token"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <Button type="submit" className="mt-4 bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('admin.addDoctor')}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('admin.manageDoctors')}</CardTitle>
              <CardDescription>
                {t('admin.manageDoctorsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.fullName')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.email')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.specialization')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {doctors.map((doctor) => (
                      <tr key={doctor.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {`${doctor.title} ${doctor.firstName} ${doctor.lastName}`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{doctor.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{doctor.specialization}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            className="text-primary hover:text-primary/80 mr-2"
                            onClick={() => handleEditDoctor(doctor)}
                          >
                            <Edit className="h-4 w-4 inline mr-1" />
                            {t('common.edit')}
                          </button>
                          <button 
                            className="text-amber-600 hover:text-amber-700 mr-2"
                            onClick={() => handleResetPassword(doctor)}
                          >
                            <Key className="h-4 w-4 inline mr-1" />
                            {t('admin.resetPassword')}
                          </button>
                          <button 
                            className="text-orange-500 hover:text-orange-600"
                            onClick={() => handleEditDoctor(doctor)}
                          >
                            <Settings className="h-4 w-4 inline mr-1" />
                            Webhook
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="container mx-auto mt-8 py-4 text-center text-sm text-muted-foreground border-t">
        <p>MedRec Admin Dashboard • v1.0 • © {new Date().getFullYear()}</p>
      </footer>

      {/* Edit Doctor Modal */}
      {isEditModalOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Doctor Information</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {editSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Doctor information updated successfully
              </div>
            )}

            <form onSubmit={handleSaveDoctor} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-firstName" className="block text-sm font-medium text-gray-700">
                    {t('common.firstName')}
                  </label>
                  <Input
                    id="edit-firstName"
                    type="text"
                    value={selectedDoctor.firstName}
                    onChange={(e) => setSelectedDoctor({...selectedDoctor, firstName: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="edit-lastName" className="block text-sm font-medium text-gray-700">
                    {t('common.lastName')}
                  </label>
                  <Input
                    id="edit-lastName"
                    type="text"
                    value={selectedDoctor.lastName}
                    onChange={(e) => setSelectedDoctor({...selectedDoctor, lastName: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <Input
                    id="edit-username"
                    type="text"
                    value={selectedDoctor.username}
                    onChange={(e) => setSelectedDoctor({...selectedDoctor, username: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedDoctor.email}
                    onChange={(e) => setSelectedDoctor({...selectedDoctor, email: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <Input
                    id="edit-title"
                    type="text"
                    value={selectedDoctor.title}
                    onChange={(e) => setSelectedDoctor({...selectedDoctor, title: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-specialization" className="block text-sm font-medium text-gray-700">
                    Specialization
                  </label>
                  <Input
                    id="edit-specialization"
                    type="text"
                    value={selectedDoctor.specialization || ''}
                    onChange={(e) => setSelectedDoctor({...selectedDoctor, specialization: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-ambulanceName" className="block text-sm font-medium text-gray-700">
                    Ambulance/Practice Name
                  </label>
                  <Input
                    id="edit-ambulanceName"
                    type="text"
                    value={selectedDoctor.ambulanceName}
                    onChange={(e) => setSelectedDoctor({...selectedDoctor, ambulanceName: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-ambulanceAddress" className="block text-sm font-medium text-gray-700">
                    Ambulance/Practice Address
                  </label>
                  <Input
                    id="edit-ambulanceAddress"
                    type="text"
                    value={selectedDoctor.ambulanceAddress}
                    onChange={(e) => setSelectedDoctor({...selectedDoctor, ambulanceAddress: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-contactPhone" className="block text-sm font-medium text-gray-700">
                    Contact Phone
                  </label>
                  <Input
                    id="edit-contactPhone"
                    type="text"
                    value={selectedDoctor.contactPhone}
                    onChange={(e) => setSelectedDoctor({...selectedDoctor, contactPhone: e.target.value})}
                  />
                </div>
              </div>

              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Webhook Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-webhookUrl" className="block text-sm font-medium text-gray-700">
                      Webhook URL
                    </label>
                    <Input
                      id="edit-webhookUrl"
                      type="url"
                      value={selectedDoctor.webhookUrl || ''}
                      onChange={(e) => setSelectedDoctor({...selectedDoctor, webhookUrl: e.target.value})}
                      placeholder="https://example.com/webhook"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="edit-apiKey" className="block text-sm font-medium text-gray-700">
                      API Key
                    </label>
                    <Input
                      id="edit-apiKey"
                      type="text"
                      value={selectedDoctor.apiKey || ''}
                      onChange={(e) => setSelectedDoctor({...selectedDoctor, apiKey: e.target.value})}
                      placeholder="Optional API key"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Authentication Type
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="edit-authNone"
                          name="edit-authType"
                          value="none"
                          checked={selectedDoctor.authType === 'none' || !selectedDoctor.authType}
                          onChange={() => setSelectedDoctor({...selectedDoctor, authType: 'none'})}
                          className="mr-2"
                        />
                        <label htmlFor="edit-authNone">None</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="edit-authBasic"
                          name="edit-authType"
                          value="basic"
                          checked={selectedDoctor.authType === 'basic'}
                          onChange={() => setSelectedDoctor({...selectedDoctor, authType: 'basic'})}
                          className="mr-2"
                        />
                        <label htmlFor="edit-authBasic">Basic</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="edit-authBearer"
                          name="edit-authType"
                          value="bearer"
                          checked={selectedDoctor.authType === 'bearer'}
                          onChange={() => setSelectedDoctor({...selectedDoctor, authType: 'bearer'})}
                          className="mr-2"
                        />
                        <label htmlFor="edit-authBearer">Bearer</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="edit-authOAuth"
                          name="edit-authType"
                          value="oauth"
                          checked={selectedDoctor.authType === 'oauth'}
                          onChange={() => setSelectedDoctor({...selectedDoctor, authType: 'oauth'})}
                          className="mr-2"
                        />
                        <label htmlFor="edit-authOAuth">OAuth</label>
                      </div>
                    </div>
                  </div>

                  {selectedDoctor.authType === 'basic' && (
                    <>
                      <div className="space-y-2">
                        <label htmlFor="edit-authUsername" className="block text-sm font-medium text-gray-700">
                          Username
                        </label>
                        <Input
                          id="edit-authUsername"
                          type="text"
                          value={selectedDoctor.authConfig?.username || ''}
                          onChange={(e) => setSelectedDoctor({
                            ...selectedDoctor,
                            authConfig: { 
                              ...selectedDoctor.authConfig || {}, 
                              username: e.target.value 
                            }
                          })}
                          placeholder="Basic Auth Username"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="edit-authPassword" className="block text-sm font-medium text-gray-700">
                          Password
                        </label>
                        <Input
                          id="edit-authPassword"
                          type="password"
                          value={selectedDoctor.authConfig?.password || ''}
                          onChange={(e) => setSelectedDoctor({
                            ...selectedDoctor,
                            authConfig: { 
                              ...selectedDoctor.authConfig || {}, 
                              password: e.target.value 
                            }
                          })}
                          placeholder="Basic Auth Password"
                        />
                      </div>
                    </>
                  )}

                  {selectedDoctor.authType === 'bearer' && (
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="edit-bearerToken" className="block text-sm font-medium text-gray-700">
                        Bearer Token
                      </label>
                      <Input
                        id="edit-bearerToken"
                        type="text"
                        value={selectedDoctor.authConfig?.bearerToken || ''}
                        onChange={(e) => setSelectedDoctor({
                          ...selectedDoctor,
                          authConfig: { 
                            ...selectedDoctor.authConfig || {}, 
                            bearerToken: e.target.value 
                          }
                        })}
                        placeholder="Bearer Token"
                      />
                    </div>
                  )}

                  {selectedDoctor.authType === 'oauth' && (
                    <>
                      <div className="space-y-2">
                        <label htmlFor="edit-oauthClientId" className="block text-sm font-medium text-gray-700">
                          Client ID
                        </label>
                        <Input
                          id="edit-oauthClientId"
                          type="text"
                          value={selectedDoctor.authConfig?.oauthClientId || ''}
                          onChange={(e) => setSelectedDoctor({
                            ...selectedDoctor,
                            authConfig: { 
                              ...selectedDoctor.authConfig || {}, 
                              oauthClientId: e.target.value 
                            }
                          })}
                          placeholder="OAuth Client ID"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="edit-oauthClientSecret" className="block text-sm font-medium text-gray-700">
                          Client Secret
                        </label>
                        <Input
                          id="edit-oauthClientSecret"
                          type="password"
                          value={selectedDoctor.authConfig?.oauthClientSecret || ''}
                          onChange={(e) => setSelectedDoctor({
                            ...selectedDoctor,
                            authConfig: { 
                              ...selectedDoctor.authConfig || {}, 
                              oauthClientSecret: e.target.value 
                            }
                          })}
                          placeholder="OAuth Client Secret"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label htmlFor="edit-oauthTokenUrl" className="block text-sm font-medium text-gray-700">
                          Token URL
                        </label>
                        <Input
                          id="edit-oauthTokenUrl"
                          type="url"
                          value={selectedDoctor.authConfig?.oauthTokenUrl || ''}
                          onChange={(e) => setSelectedDoctor({
                            ...selectedDoctor,
                            authConfig: { 
                              ...selectedDoctor.authConfig || {}, 
                              oauthTokenUrl: e.target.value 
                            }
                          })}
                          placeholder="https://example.com/oauth/token"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {isPasswordResetModalOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Reset Password</h2>
              <button 
                onClick={() => setIsPasswordResetModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {passwordResetSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Password reset successfully
              </div>
            )}

            <p className="mb-4 text-gray-600">
              Resetting password for: <span className="font-medium">{selectedDoctor.firstName} {selectedDoctor.lastName}</span>
            </p>

            <form onSubmit={handleSaveNewPassword} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsPasswordResetModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Reset Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
