import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Send, AlertCircle, CheckCircle, Loader2, Lock, Lock as LockOpen, Stethoscope, Clock, FileAudio } from 'lucide-react';

import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';
import { RadioGroup, RadioGroupItem } from './components/ui/radio-group';
import { AudioWave } from './components/audio-wave';
import { PatientInfo } from './components/patient-info';
import { cn, formatTime } from './lib/utils';

type AuthType = 'none' | 'basic';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState<string>('https://example.com/webhook');
  const [authType, setAuthType] = useState<AuthType>('none');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [audioURL]);

  // Handle audio playback state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onplay = () => setIsPlaying(true);
      audioRef.current.onpause = () => setIsPlaying(false);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.onplay = null;
        audioRef.current.onpause = null;
        audioRef.current.onended = null;
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    try {
      // Reset previous recording
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
        setAudioURL(null);
        setAudioBlob(null);
      }
      
      audioChunksRef.current = [];
      setStatus('idle');
      setErrorMessage(null);
      setRecordingDuration(0);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setAudioBlob(audioBlob);
        
        // Create audio element for playback control
        const audio = new Audio(url);
        audioRef.current = audio;
        
        // Stop all audio tracks
        stream.getAudioTracks().forEach(track => track.stop());
        
        // Clear the timer
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start the timer
      timerRef.current = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setErrorMessage('Could not access microphone. Please ensure you have granted permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (audioURL && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const submitRecording = async () => {
    if (!audioBlob) {
      setErrorMessage('No recording to submit. Please record audio first.');
      return;
    }

    if (!webhookUrl || !webhookUrl.startsWith('http')) {
      setErrorMessage('Please enter a valid webhook URL');
      return;
    }

    // Validate basic auth credentials if that auth type is selected
    if (authType === 'basic' && (!username || !password)) {
      setErrorMessage('Basic authentication requires both username and password');
      return;
    }

    setStatus('uploading');
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      // Prepare headers
      const headers: HeadersInit = {
        'Accept': 'application/json, text/plain, */*',
      };

      // Add Basic Authentication if selected
      if (authType === 'basic') {
        const base64Credentials = btoa(`${username}:${password}`);
        headers['Authorization'] = `Basic ${base64Credentials}`;
      }

      // Add headers for better compatibility with various webhook endpoints
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
        headers,
        // Add mode: 'cors' to handle cross-origin requests
        mode: 'cors',
      });

      // Handle different response status codes
      if (response.status === 404) {
        throw new Error('Webhook endpoint not found (404). Please check the URL and try again.');
      } else if (response.status === 403) {
        throw new Error('Access to the webhook is forbidden (403). The endpoint may require authentication.');
      } else if (response.status === 401) {
        throw new Error('Authentication failed (401). Please check your credentials.');
      } else if (response.status >= 400) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Server error (${response.status}): ${errorText || response.statusText}`);
      }

      setStatus('success');
    } catch (error) {
      console.error('Error uploading audio:', error);
      
      // Provide more helpful error messages based on error type
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setErrorMessage('Network error: Could not connect to the webhook. This might be due to CORS restrictions or the server being unavailable.');
      } else {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to upload recording');
      }
      
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col p-4 md:p-8">
      <header className="container mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">MedVoice Recorder</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto flex-1 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <PatientInfo />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileAudio className="h-5 w-5" />
                  Audio Recording
                </CardTitle>
                <CardDescription>
                  Record and save patient consultation audio
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center p-6 bg-secondary/50 rounded-lg border border-border">
                  {isRecording ? (
                    <div className="flex flex-col items-center">
                      <div className="mb-4">
                        <AudioWave />
                      </div>
                      <div className="flex items-center text-destructive font-medium">
                        <div className="w-3 h-3 rounded-full bg-destructive animate-pulse-recording mr-2"></div>
                        Recording in progress
                      </div>
                      <div className="mt-2 text-2xl font-mono">
                        {formatTime(recordingDuration)}
                      </div>
                    </div>
                  ) : audioURL ? (
                    <div className="flex flex-col items-center">
                      <div className="text-lg font-medium mb-2">Recording complete</div>
                      <div className="text-muted-foreground mb-4">
                        Duration: {formatTime(recordingDuration)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon-lg" 
                          onClick={playRecording}
                          className="rounded-full"
                        >
                          {isPlaying ? (
                            <Square className="h-6 w-6" />
                          ) : (
                            <Play className="h-6 w-6" />
                          )}
                        </Button>
                        <Button 
                          variant="default" 
                          size="icon-lg" 
                          onClick={submitRecording}
                          disabled={status === 'uploading'}
                          className="rounded-full"
                        >
                          <Send className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="text-lg font-medium mb-4">Ready to record</div>
                      <Button 
                        variant="destructive" 
                        size="icon-xl" 
                        onClick={startRecording}
                        className="mb-2"
                      >
                        <Mic className="h-6 w-6" />
                      </Button>
                      <div className="text-sm text-muted-foreground">
                        Click to start recording
                      </div>
                    </div>
                  )}
                </div>
                
                {isRecording && (
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      onClick={stopRecording}
                      className="rounded-full"
                    >
                      <Square className="h-5 w-5 mr-2" />
                      Stop Recording
                    </Button>
                  </div>
                )}
                
                {status === 'uploading' && (
                  <div className="flex items-center justify-center p-3 bg-primary/10 rounded-md text-primary">
                    <Loader2 className="animate-spin mr-2" size={20} />
                    <span>Uploading recording...</span>
                  </div>
                )}

                {status === 'success' && (
                  <div className="flex items-center justify-center p-3 bg-green-50 rounded-md text-green-600">
                    <CheckCircle className="mr-2" size={20} />
                    <span>Recording uploaded successfully!</span>
                  </div>
                )}

                {errorMessage && (
                  <div className="flex items-center p-3 bg-destructive/10 rounded-md text-destructive">
                    <AlertCircle className="mr-2 flex-shrink-0" size={20} />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Webhook Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="webhook-url" className="text-sm font-medium">
                    Webhook URL
                  </label>
                  <Input
                    id="webhook-url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://your-webhook-url.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    The webhook must accept POST requests with multipart/form-data
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Authentication
                  </label>
                  <RadioGroup value={authType} onChange={(value) => setAuthType(value as AuthType)}>
                    <RadioGroupItem value="none">
                      <div className="flex items-center">
                        <LockOpen className="h-4 w-4 mr-2" />
                        <span>None</span>
                      </div>
                    </RadioGroupItem>
                    <RadioGroupItem value="basic">
                      <div className="flex items-center">
                        <Lock className="h-4 w-4 mr-2" />
                        <span>Basic Auth</span>
                      </div>
                    </RadioGroupItem>
                  </RadioGroup>
                </div>
                
                {authType === 'basic' && (
                  <div className="space-y-3 pt-2">
                    <div className="space-y-2">
                      <label htmlFor="username" className="text-sm font-medium">
                        Username
                      </label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <Input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 list-decimal list-inside text-sm">
                  <li>Enter patient information</li>
                  <li>Configure webhook settings</li>
                  <li>Click the microphone button to start recording</li>
                  <li>Click stop when finished</li>
                  <li>Preview the recording if needed</li>
                  <li>Click send to upload to medical records</li>
                </ol>
                <p className="mt-4 text-xs text-muted-foreground">
                  For technical support, please contact the IT department.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto mt-8 text-center text-sm text-muted-foreground">
        <p>MedVoice Recorder v1.0 • HIPAA Compliant • © 2025 Medical Systems Inc.</p>
      </footer>
    </div>
  );
}

export default App;