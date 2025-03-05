import React, { useState, useRef, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { PatientInfo } from '../components/patient-info';
import { AudioWave } from '../components/audio-wave';
import { formatTime } from '../lib/utils';
import { t } from '../lib/i18n';
import { 
  Stethoscope, 
  Mic, 
  Square, 
  Play, 
  Send, 
  Trash2, 
  LogOut, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Clipboard
} from 'lucide-react';

const DoctorDashboard: React.FC = () => {
  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Transcription state
  const [transcription, setTranscription] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionSuccess, setTranscriptionSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  // Refs
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
      setError(null);
      setRecordingDuration(0);
      setTranscription('');
      setTranscriptionSuccess(false);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create a new MediaRecorder with specific MIME type for better browser compatibility
      const options = { mimeType: 'audio/webm' };
      let mediaRecorder;
      
      try {
        mediaRecorder = new MediaRecorder(stream, options);
      } catch (e) {
        // Fallback for Safari and other browsers
        mediaRecorder = new MediaRecorder(stream);
      }
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Create audio blob with a widely supported format
        // Use 'audio/mp4' for better Safari compatibility
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp4' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setAudioBlob(audioBlob);
        
        // Create audio element for playback control
        const audio = new Audio();
        
        // Set preload attribute to auto to ensure the audio is loaded immediately
        audio.preload = 'auto';
        
        // Add event listener for when the audio is loaded
        audio.addEventListener('canplaythrough', () => {
          console.log('Audio loaded and ready to play');
        });
        
        // Set the source after adding event listeners
        audio.src = url;
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
      setError('Could not access microphone. Please ensure you have granted permission.');
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
        // For Safari compatibility - Add a small delay to ensure audio is loaded
        if (audioRef.current.paused) {
          // Set currentTime to 0 to ensure we play from the beginning
          audioRef.current.currentTime = 0;
          
          // Add a small delay before playing to ensure the audio is ready
          // This helps with Safari and Firefox which might have issues with immediate playback
          setTimeout(() => {
            audioRef.current?.play().catch(error => {
              console.error('Error playing audio:', error);
              setError('Could not play the recording. Your browser may not support this audio format.');
            });
          }, 300);
        }
      }
    }
  };

  const deleteRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
      setAudioBlob(null);
      setRecordingDuration(0);
      setTranscription('');
      setTranscriptionSuccess(false);
      setError(null);
    }
  };

  const handleExportDocument = (format: 'pdf' | 'docx') => {
    if (!transcription) {
      setError('No transcription to export. Please transcribe the recording first.');
      return;
    }

    try {
      // Get patient information
      const patientName = document.querySelector('#patient-name')?.getAttribute('value') || 'Unknown Patient';
      const patientId = document.querySelector('#patient-id')?.getAttribute('value') || 'Unknown ID';
      const currentDate = new Date().toLocaleDateString();
      
      // Create a simple text representation of the document
      const documentContent = `
Medical Transcription
---------------------
Patient: ${patientName}
ID: ${patientId}
Date: ${currentDate}

${transcription}
      `;
      
      // Create a blob with the content
      const blob = new Blob([documentContent], { type: 'text/plain;charset=utf-8' });
      
      // Save the file with appropriate name and extension
      if (format === 'pdf') {
        // In a real app, you would use a PDF generation library
        // For this demo, we'll just save a text file with .pdf extension
        saveAs(blob, `transcription_${patientName.replace(/\s+/g, '_')}_${currentDate.replace(/\//g, '-')}.pdf`);
      } else {
        // In a real app, you would use a DOCX generation library
        // For this demo, we'll just save a text file with .docx extension
        saveAs(blob, `transcription_${patientName.replace(/\s+/g, '_')}_${currentDate.replace(/\//g, '-')}.docx`);
      }
    } catch (error) {
      console.error('Error exporting document:', error);
      setError('Failed to export document. Please try again.');
    }
  };

  const transcribeRecording = async () => {
    if (!audioBlob) {
      setError('No recording to transcribe. Please record audio first.');
      return;
    }

    setIsTranscribing(true);
    setError(null);

    try {
      // Simulate transcription with a timeout
      // In a real app, this would call the webhook configured in the admin dashboard
      setTimeout(() => {
        setTranscription("Patient reports experiencing headaches for the past two weeks, primarily in the morning. No previous history of migraines. Currently taking ibuprofen as needed for pain management. Blood pressure is within normal range at 120/80. Patient also mentions occasional dizziness when standing up quickly. Recommended further tests to rule out potential causes and scheduled a follow-up appointment in two weeks.");
        setIsTranscribing(false);
        setTranscriptionSuccess(true);
      }, 3000);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setError('Failed to transcribe the recording. Please try again.');
      setIsTranscribing(false);
    }
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <PatientInfo />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  {t('doctor.audioRecording')}
                </CardTitle>
                <CardDescription>
                  {t('doctor.audioRecordingDesc')}
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
                        {t('doctor.recording')}
                      </div>
                      <div className="mt-2 text-2xl font-mono">
                        {formatTime(recordingDuration)}
                      </div>
                    </div>
                  ) : audioURL ? (
                    <div className="flex flex-col items-center">
                      <div className="text-lg font-medium mb-2">{t('doctor.recordingComplete')}</div>
                      <div className="text-muted-foreground mb-4">
                        {t('doctor.duration')}: {formatTime(recordingDuration)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={playRecording}
                          className="rounded-full h-10 w-10"
                        >
                          {isPlaying ? (
                            <Square className="h-5 w-5" />
                          ) : (
                            <Play className="h-5 w-5" />
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={deleteRecording}
                          className="rounded-full h-10 w-10 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                        <Button 
                          variant="default" 
                          onClick={transcribeRecording}
                          disabled={isTranscribing}
                          className="rounded-full"
                        >
                          {isTranscribing ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              {t('doctor.transcribing')}
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              {t('doctor.transcribe')}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="text-lg font-medium mb-4">{t('doctor.readyToRecord')}</div>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={startRecording}
                        className="mb-2 rounded-full h-16 w-16"
                      >
                        <Mic className="h-8 w-8" />
                      </Button>
                      <div className="text-sm text-muted-foreground">
                        {t('doctor.instructionsList.step2')}
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
                      {t('doctor.instructionsList.step3')}
                    </Button>
                  </div>
                )}
                
                {error && (
                  <div className="flex items-center p-3 bg-destructive/10 rounded-md text-destructive">
                    <AlertCircle className="mr-2 flex-shrink-0" size={20} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Transcription Area */}
                {(transcription || isTranscribing) && (
                  <Card className="mt-6">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{t('doctor.transcription')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isTranscribing ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <div className="relative h-16 w-16 mb-4">
                            <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
                          </div>
                          <p className="text-muted-foreground">{t('doctor.transcribing')}</p>
                        </div>
                      ) : transcriptionSuccess ? (
                        <div className="space-y-4">
                          <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center text-green-700 mb-4">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            <span>{t('doctor.transcriptionSuccess')}</span>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-md">
                            <p className="whitespace-pre-line">{transcription}</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <Button 
                              variant="outline"
                              onClick={() => {
                                navigator.clipboard.writeText(transcription)
                                  .then(() => {
                                    setIsCopied(true);
                                    setTimeout(() => {
                                      setIsCopied(false);
                                    }, 2000);
                                  })
                                  .catch(err => {
                                    console.error('Failed to copy text: ', err);
                                    setError('Failed to copy to clipboard. Please try again.');
                                  });
                              }}
                              className={`flex items-center gap-1 ${isCopied ? 'bg-green-500 hover:bg-green-600 text-white border-green-500' : ''}`}
                            >
                              {isCopied ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <Clipboard className="h-4 w-4" />
                              )}
                              <span>{isCopied ? t('common.copied') : t('common.copy')}</span>
                            </Button>
                            <div className="flex">
                              <Button variant="outline" className="mr-2">
                                {t('common.edit')}
                              </Button>
                              <div className="relative">
                                <Button className="mr-2">
                                  {t('doctor.saveToPatient')}
                                </Button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                  <div className="py-1">
                                    <button 
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                      onClick={() => handleExportDocument('pdf')}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                      </svg>
                                      {t('doctor.exportAsPdf')}
                                    </button>
                                    <button 
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                      onClick={() => handleExportDocument('docx')}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                      </svg>
                                      {t('doctor.exportAsWord')}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('doctor.recentPatients')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-muted-foreground">{t('doctor.appointment')}: Today, 9:00 AM</p>
                    </div>
                    <Button variant="ghost" size="sm">{t('common.view')}</Button>
                  </li>
                  <li className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">Jane Smith</p>
                      <p className="text-sm text-muted-foreground">{t('doctor.appointment')}: Today, 10:30 AM</p>
                    </div>
                    <Button variant="ghost" size="sm">{t('common.view')}</Button>
                  </li>
                  <li className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">Robert Johnson</p>
                      <p className="text-sm text-muted-foreground">{t('doctor.appointment')}: Today, 1:15 PM</p>
                    </div>
                    <Button variant="ghost" size="sm">{t('common.view')}</Button>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('doctor.instructions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 list-decimal list-inside text-sm">
                  <li>{t('doctor.instructionsList.step1')}</li>
                  <li>{t('doctor.instructionsList.step2')}</li>
                  <li>{t('doctor.instructionsList.step3')}</li>
                  <li>{t('doctor.instructionsList.step4')}</li>
                  <li>{t('doctor.instructionsList.step5')}</li>
                  <li>{t('doctor.instructionsList.step6')}</li>
                </ol>
                <p className="mt-4 text-xs text-muted-foreground">
                  {t('doctor.support')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="container mx-auto mt-8 py-4 text-center text-sm text-muted-foreground border-t">
        <p>MedRec Doctor Dashboard • v1.0 • © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default DoctorDashboard;
