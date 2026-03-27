'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Scan, X, Sparkles as SparklesIcon, Loader2 } from 'lucide-react';
import { moods } from '@/lib/mockData';
import { useMood } from '@/lib/moodContext';
import * as faceapi from 'face-api.js';

interface MoodScannerProps {
  onMoodSelect: (mood: string) => void;
  selectedMood: string | null;
}

export default function MoodScanner({ onMoodSelect, selectedMood }: MoodScannerProps) {
  const { setCurrentMood } = useMood();
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [hasCameraError, setHasCameraError] = useState(false);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [detectedExpression, setDetectedExpression] = useState<string>('');
  const [detectionConfidence, setDetectionConfidence] = useState(0);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addLog = (msg: string) => {
    setDebugLog(prev => [msg, ...prev].slice(0, 5));
    console.log(`[MoodScanner] ${msg}`);
  };

  const moodMessages: Record<string, string> = {
    Happy: 'You seem happy today! 🌟',
    Sad: 'I sense some blues... Let me comfort you 💙',
    Angry: 'Feeling intense? Let\'s channel that energy 🔥',
    Calm: 'You seem calm today 💙',
    Energetic: 'Full of energy! Let\'s go! ⚡',
  };

  // References for camera
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Load models on mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        addLog('Loading models...');
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]);
        setIsModelsLoaded(true);
        addLog('Models loaded successfully');
      } catch (err) {
        addLog(`Model load error: ${err instanceof Error ? err.message : String(err)}`);
        console.error('Failed to load face-api models:', err);
      }
    };
    loadModels();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const saveMoodToDb = async (moodName: string) => {
    try {
      const moodScores: Record<string, number> = {
        Happy: Math.floor(Math.random() * 20) + 75, // 75-95
        Sad: Math.floor(Math.random() * 20) + 20,    // 20-40
        Angry: Math.floor(Math.random() * 20) + 30,  // 30-50
        Calm: Math.floor(Math.random() * 20) + 60,   // 60-80
        Energetic: Math.floor(Math.random() * 20) + 80 // 80-100
      };

      await fetch('/api/user/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mood: moodName, 
          score: moodScores[moodName] || 50 
        })
      });
    } catch (err) {
      console.error('Failed to save mood context:', err);
    }
  };

  const mapExpressionToMood = (expression: string): string => {
    const map: Record<string, string> = {
      happy: 'Happy',
      sad: 'Sad',
      angry: 'Angry',
      neutral: 'Calm',
      surprised: 'Energetic',
      fearful: 'Energetic',
      disgusted: 'Angry',
    };
    return map[expression] || 'Calm';
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !isModelsLoaded) return;

    try {
      setAiMessage('Capturing your vibe...');
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Match dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      
      addLog('Photo captured, analyzing...');
      setAiMessage('Analyzing your expression...');

      // Detect on the canvas
      const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.1 });
      const detections = await faceapi.detectAllFaces(canvas, options).withFaceExpressions();

      if (detections && detections.length > 0) {
        const result = detections[0];
        const expressions = Object.entries(result.expressions).sort((a, b) => b[1] - a[1]);
        const primaryExpr = expressions[0][0];
        const moodifyName = mapExpressionToMood(primaryExpr);
        
        addLog(`Match found: ${primaryExpr}`);
        setAiMessage(`You look ${primaryExpr}!`);
        
        setTimeout(() => {
          stopCamera();
          onMoodSelect(moodifyName);
          setCurrentMood(moodifyName as any);
          saveMoodToDb(moodifyName);
          setAiMessage(moodMessages[moodifyName]);
          setIsScanning(false);
          setScanComplete(true);
          setIsCameraModalOpen(false);
          setCapturedImage(null);
        }, 1500);
      } else {
        addLog('No face in photo');
        setAiMessage("We couldn't see your face clearly. Try again! 📸");
        setCapturedImage(null);
      }
    } catch (err) {
      addLog('Capture error');
      console.error(err);
      setAiMessage('Error during analysis. Please try again.');
    }
  };

  const startScan = async () => {
    if (!isModelsLoaded) {
      setAiMessage('Please wait, AI models are still loading...');
      return;
    }

    setIsCameraModalOpen(true);
    setIsScanning(true);
    setScanComplete(false);
    setHasCameraError(false);
    setAiMessage('Starting camera...');
    setCapturedImage(null); // Clear any previous captured image

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => console.error("Play error:", e));
        };
      }
      
      setAiMessage('Camera active! Tap the shutter to capture your mood.');
      addLog('Camera started, waiting for capture');
      
      // No continuous detection loop here, it's now manual capture.
      // The previous processFrame logic is replaced by captureAndAnalyze.

    } catch (err) {
      console.error('Camera error:', err);
      setHasCameraError(true);
      setAiMessage('Camera access denied. Resolving randomly...');
      
      setTimeout(() => {
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        onMoodSelect(randomMood.name);
        setCurrentMood(randomMood.name as any);
        saveMoodToDb(randomMood.name);
        setAiMessage(moodMessages[randomMood.name]);
        setIsScanning(false);
        setScanComplete(true);
        setIsCameraModalOpen(false);
      }, 2000);
    }
  };

  const handleManualSelect = (mood: string) => {
    onMoodSelect(mood);
    setCurrentMood(mood as any);
    saveMoodToDb(mood); // Save to DB
    setAiMessage(moodMessages[mood]);
    setScanComplete(true);
    setIsScanning(false);
  };


  return (
    <div className="space-y-6">
      {/* MoodScan title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Scan className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">MoodScan™</h2>
          <p className="text-xs text-white/40">AI-powered mood detection</p>
        </div>
      </div>

      {/* Scan button */}
      <motion.button
        onClick={startScan}
        disabled={isScanning}
        className="relative w-full glass-strong rounded-3xl p-8 flex flex-col items-center gap-6 group overflow-hidden border border-white/10 shadow-3xl"
        whileHover={{ scale: 1.01, border: '1px solid rgba(192, 132, 252, 0.3)' }}
        whileTap={{ scale: 0.99 }}
      >
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-700 shadow-2xl ${
          isScanning 
            ? 'bg-purple-500/30 neon-glow-purple scale-110' 
            : 'bg-white/5 group-hover:bg-purple-500/20 group-hover:scale-105'
        }`}>
          <Camera className={`w-10 h-10 transition-colors ${isScanning ? 'text-purple-300' : 'text-white/60 group-hover:text-purple-300'}`} />
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-white/80">
            {isScanning ? 'Camera active...' : 'Tap to Scan Your Mood'}
          </p>
          <p className="text-xs text-white/40 mt-1">Uses your camera to detect emotions</p>
        </div>
      </motion.button>

      {/* Camera Modal */}
      <AnimatePresence>
        {isCameraModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
              onClick={stopCamera}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl glass-strong rounded-[2.5rem] overflow-hidden border border-white/20 shadow-4xl flex flex-col"
            >
              {/* Camera Header */}
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Emotion Analysis</h3>
                    <p className="text-xs text-white/40">Powered by Face-API.js</p>
                  </div>
                </div>
                <button 
                  onClick={stopCamera}
                  className="w-10 h-10 rounded-full glass hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Camera Feed */}
              <div className="relative flex-1 bg-black overflow-hidden m-6 rounded-[2rem] border border-white/5 aspect-video">
                {!hasCameraError && (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                )}
                
                {/* Detection Overlays - POSITIONED HIGHER FOR VISIBILITY */}
                <div className="absolute inset-x-0 bottom-0 p-8 pb-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col items-center gap-6 text-center z-50">
                  <div className="flex flex-col items-center gap-2 mb-4">
                    <p className="text-sm font-bold text-white tracking-widest uppercase bg-purple-600/60 px-4 py-1 rounded-full backdrop-blur-md">
                      {aiMessage || "READY TO CAPTURE"}
                    </p>
                  </div>

                  {/* Shutter Button - ENHANCED VISIBILITY */}
                  {(!capturedImage && !scanComplete) && (
                    <motion.div
                      className="flex flex-col items-center gap-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          captureAndAnalyze();
                        }}
                        disabled={!isModelsLoaded}
                        className="relative w-24 h-24 flex items-center justify-center group active:scale-95 transition-transform"
                        title="Capture Photo"
                      >
                        {/* Shutter Outer Ring */}
                        <div className="absolute inset-0 rounded-full border-4 border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
                        {/* Shutter Inner Circle */}
                        <div className="w-16 h-16 rounded-full bg-white shadow-2xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                          <div className="w-14 h-14 rounded-full border-2 border-black/5" />
                        </div>
                        {/* Pulsing effect */}
                        <div className="absolute inset-0 rounded-full border-2 border-purple-400/50 animate-ping opacity-20 pointer-events-none" />
                      </button>
                      <p className="text-white font-bold text-sm tracking-tighter shadow-sm">CLICK TO SCAN</p>
                    </motion.div>
                  )}

                  {capturedImage && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                       <motion.div 
                         initial={{ scale: 0.8, opacity: 0 }}
                         animate={{ scale: 1, opacity: 1 }}
                         className="relative w-64 aspect-square rounded-[2rem] overflow-hidden border-4 border-purple-500 shadow-2xl"
                       >
                         <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                         <div className="absolute inset-x-0 bottom-0 bg-purple-500 py-2 text-xs font-bold text-white">ANALYZING...</div>
                       </motion.div>
                    </div>
                  )}
                  
                  {/* Scan Line animation */}
                  {!capturedImage && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      animate={{ opacity: [0.2, 0.4, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <motion.div
                        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Hidden Canvas for Capture */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Debug Logs Overlay */}
              <div className="absolute top-20 left-6 z-20 pointer-events-none">
                <div className="bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/10 max-w-[200px]">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Debug Console</p>
                  <div className="space-y-1">
                    {debugLog.map((log, i) => (
                      <p key={i} className="text-[10px] text-white/70 font-mono truncate">{log}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              <div className="bg-black/40 border-t border-white/10 p-4 flex items-center justify-center gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  AI Face Scanning Active
                </div>
                {!isModelsLoaded && (
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Loading Models...
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI message */}
      <AnimatePresence mode="wait">
        {aiMessage && (
          <motion.div
            key={aiMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm text-white/80">{aiMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual mood selection */}
      <div>
        <p className="text-xs text-white/40 mb-3 uppercase tracking-wider">Or select manually</p>
        <div className="flex gap-2 flex-wrap">
          {moods.map((mood) => (
            <motion.button
              key={mood.name}
              onClick={() => handleManualSelect(mood.name)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                selectedMood === mood.name
                  ? 'bg-white/15 text-white ring-1 ring-white/20'
                  : 'glass text-white/60 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">{mood.emoji}</span>
              <span>{mood.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
    </svg>
  );
}
