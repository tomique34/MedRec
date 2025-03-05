import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Stethoscope, FileAudio, Calendar, Shield, Users } from 'lucide-react';
import { LanguageSelector } from '../components/LanguageSelector';
import { t, getCurrentLanguage } from '../lib/i18n';

const HomePage: React.FC = () => {
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
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">MedRec</h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Link to="/login" className="text-gray-600 hover:text-gray-900">{t('auth.signIn')}</Link>
            <Button className="bg-primary hover:bg-primary/90">
              {t('home.getStarted')}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('home.title')}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {t('home.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-primary hover:bg-primary/90 text-lg py-6 px-8"
                onClick={() => window.open('https://calendly.com', '_blank')}
              >
                {t('home.bookDemo')}
              </Button>
              <Link to="/login">
                <Button variant="outline" className="text-lg py-6 px-8">
                  {t('auth.signIn')}
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full z-0"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-100 rounded-full z-0"></div>
              <div className="relative z-10 bg-white p-6 rounded-xl shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <FileAudio className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-semibold">Voice to Text</h3>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="h-3 bg-gray-100 rounded-full w-full"></div>
                  <div className="h-3 bg-gray-100 rounded-full w-5/6"></div>
                  <div className="h-3 bg-gray-100 rounded-full w-4/6"></div>
                </div>
                <div className="flex justify-end">
                  <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('home.features')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FileAudio className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Audio Recording</h3>
              <CardContent className="p-0">
                <p className="text-gray-600">Record patient consultations with high-quality audio capture that works across all browsers and devices.</p>
              </CardContent>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Automatic Transcription</h3>
              <CardContent className="p-0">
                <p className="text-gray-600">Convert audio to text with our advanced AI transcription service for accurate medical documentation.</p>
              </CardContent>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Online Booking</h3>
              <CardContent className="p-0">
                <p className="text-gray-600">Schedule appointments with Calendly integration for seamless patient management.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Trusted by Healthcare Professionals</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our platform helps medical professionals save time and improve patient care with efficient documentation.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">10x</div>
                <div className="text-gray-600">Faster documentation</div>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">98%</div>
                <div className="text-gray-600">Transcription accuracy</div>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-gray-600">Healthcare providers</div>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-gray-600">Secure access</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <img 
              src="https://placehold.co/600x400/e6f7ff/0099ff?text=Healthcare+Professionals" 
              alt="Healthcare Professionals" 
              className="rounded-lg shadow-xl max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Calendly Integration */}
      <section className="bg-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('home.schedule')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('home.scheduleSubtitle')}
            </p>
          </div>
          <div className="flex justify-center">
            <Button 
              className="bg-primary hover:bg-primary/90 text-lg py-6 px-8" 
              onClick={() => window.open('https://calendly.com', '_blank')}
            >
              <Calendar className="mr-2 h-5 w-5" />
              {t('home.bookMeeting')}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">MedRec</h3>
              </div>
              <p className="text-gray-400">Streamlining medical records for healthcare professionals.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">HIPAA Compliance</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">Email: info@medrec.com</li>
                <li className="text-gray-400">Phone: (123) 456-7890</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} MedRec. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
