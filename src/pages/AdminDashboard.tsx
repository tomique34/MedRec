import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Stethoscope, Settings, Users, LogOut, CheckCircle, Plus } from 'lucide-react';
import { t } from '../lib/i18n';

interface Doctor {
  id: number;
  name: string;
  email: string;
  specialization: string;
}

const AdminDashboard: React.FC = () => {
  // Webhook configuration state
  const [webhookUrl, setWebhookUrl] = useState('https://api.example.com/webhook');
  const [apiKey, setApiKey] = useState('sk_test_123456789');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Authentication options
  const [authType, setAuthType] = useState<'none' | 'basic' | 'bearer' | 'oauth'>('none');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [bearerToken, setBearerToken] = useState('');
  const [oauthClientId, setOauthClientId] = useState('');
  const [oauthClientSecret, setOauthClientSecret] = useState('');
  const [oauthTokenUrl, setOauthTokenUrl] = useState('');

  // Doctor management state
  const [doctors, setDoctors] = useState<Doctor[]>([
    { id: 1, name: 'Dr. John Smith', email: 'john.smith@example.com', specialization: 'Cardiology' },
    { id: 2, name: 'Dr. Sarah Johnson', email: 'sarah.johnson@example.com', specialization: 'Neurology' },
  ]);
  const [newDoctor, setNewDoctor] = useState({ name: '', email: '', specialization: '', password: '' });
  const [addDoctorSuccess, setAddDoctorSuccess] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState('webhook');

  const handleSaveWebhookConfig = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to a backend
    console.log('Saving webhook config:', { webhookUrl, apiKey });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to create a new doctor account
    const newDoctorWithId = {
      ...newDoctor,
      id: doctors.length + 1,
    };
    setDoctors([...doctors, newDoctorWithId]);
    setNewDoctor({ name: '', email: '', specialization: '', password: '' });
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
              <span className="ml-2 bg-blue-100 text-primary px-2 py-0.5 rounded text-sm font-medium">
                {t('admin.title')}
              </span>
            </div>
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
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex mb-6 border-b">
          <button
            className={`px-4 py-2 font-medium flex items-center ${
              activeTab === 'webhook' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('webhook')}
          >
            <Settings className="h-5 w-5 mr-2" />
            {t('admin.webhookConfig')}
          </button>
          <button
            className={`px-4 py-2 font-medium flex items-center ${
              activeTab === 'doctors' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('doctors')}
          >
            <Users className="h-5 w-5 mr-2" />
            {t('admin.doctorManagement')}
          </button>
        </div>

        {activeTab === 'webhook' && (
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.webhookConfig')}</CardTitle>
              <CardDescription>
                {t('admin.webhookConfigDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {saveSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {t('admin.configSaved')}
                </div>
              )}

              <form onSubmit={handleSaveWebhookConfig} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-700">
                    {t('admin.webhookUrl')}
                  </label>
                  <Input
                    id="webhookUrl"
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://api.example.com/webhook"
                  />
                  <p className="text-sm text-muted-foreground">
                    {t('admin.webhookUrlDesc')}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.authMethod')}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <button
                        type="button"
                        className={`px-3 py-2 text-sm border rounded-md flex items-center justify-center ${
                          authType === 'none' 
                            ? 'bg-primary/10 border-primary text-primary' 
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setAuthType('none')}
                      >
                        {t('admin.none')}
                      </button>
                      <button
                        type="button"
                        className={`px-3 py-2 text-sm border rounded-md flex items-center justify-center ${
                          authType === 'basic' 
                            ? 'bg-primary/10 border-primary text-primary' 
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setAuthType('basic')}
                      >
                        {t('admin.basicAuth')}
                      </button>
                      <button
                        type="button"
                        className={`px-3 py-2 text-sm border rounded-md flex items-center justify-center ${
                          authType === 'bearer' 
                            ? 'bg-primary/10 border-primary text-primary' 
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setAuthType('bearer')}
                      >
                        {t('admin.bearerToken')}
                      </button>
                      <button
                        type="button"
                        className={`px-3 py-2 text-sm border rounded-md flex items-center justify-center ${
                          authType === 'oauth' 
                            ? 'bg-primary/10 border-primary text-primary' 
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setAuthType('oauth')}
                      >
                        {t('admin.oauth')}
                      </button>
                    </div>
                  </div>

                  {authType === 'basic' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-md">
                      <div className="space-y-2">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                          {t('admin.username')}
                        </label>
                        <Input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter username"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                          {t('admin.password')}
                        </label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password"
                        />
                      </div>
                    </div>
                  )}

                  {authType === 'bearer' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-md">
                      <div className="space-y-2">
                        <label htmlFor="bearerToken" className="block text-sm font-medium text-gray-700">
                          {t('admin.token')}
                        </label>
                        <Input
                          id="bearerToken"
                          type="text"
                          value={bearerToken}
                          onChange={(e) => setBearerToken(e.target.value)}
                          placeholder="Enter bearer token"
                        />
                      </div>
                    </div>
                  )}

                  {authType === 'oauth' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-md">
                      <div className="space-y-2">
                        <label htmlFor="oauthClientId" className="block text-sm font-medium text-gray-700">
                          {t('admin.clientId')}
                        </label>
                        <Input
                          id="oauthClientId"
                          type="text"
                          value={oauthClientId}
                          onChange={(e) => setOauthClientId(e.target.value)}
                          placeholder="Enter OAuth client ID"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="oauthClientSecret" className="block text-sm font-medium text-gray-700">
                          {t('admin.clientSecret')}
                        </label>
                        <Input
                          id="oauthClientSecret"
                          type="password"
                          value={oauthClientSecret}
                          onChange={(e) => setOauthClientSecret(e.target.value)}
                          placeholder="Enter OAuth client secret"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="oauthTokenUrl" className="block text-sm font-medium text-gray-700">
                          {t('admin.tokenUrl')}
                        </label>
                        <Input
                          id="oauthTokenUrl"
                          type="text"
                          value={oauthTokenUrl}
                          onChange={(e) => setOauthTokenUrl(e.target.value)}
                          placeholder="https://auth.example.com/oauth/token"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                      {t('admin.apiKey')}
                    </label>
                    <Input
                      id="apiKey"
                      type="text"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter API key"
                    />
                    <p className="text-sm text-muted-foreground">
                      {t('admin.apiKeyDesc')}
                    </p>
                  </div>
                </div>

                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {t('common.save')}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === 'doctors' && (
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
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        {t('admin.fullName')}
                      </label>
                      <Input
                        id="name"
                        type="text"
                        value={newDoctor.name}
                        onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                        placeholder="Dr. Jane Doe"
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
                        placeholder="jane.doe@example.com"
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
                            <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{doctor.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{doctor.specialization}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-primary hover:text-primary/80 mr-4">{t('common.edit')}</button>
                            <button className="text-destructive hover:text-destructive/80">{t('common.delete')}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="container mx-auto mt-8 py-4 text-center text-sm text-muted-foreground border-t">
        <p>MedRec Admin Dashboard • v1.0 • © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
