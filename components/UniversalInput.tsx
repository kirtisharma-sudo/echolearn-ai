import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, StopCircle, X, Loader2 } from 'lucide-react';

interface UniversalInputProps {
  featureTitle: string;
  isProcessing: boolean;
  onSubmit: (text: string, blob?: Blob) => void;
  onCancel: () => void;
  translations: any;
  customPlaceholder?: string;
}

const UniversalInput: React.FC<UniversalInputProps> = ({ featureTitle, isProcessing, onSubmit, onCancel, translations: t, customPlaceholder }) => {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => setRecordingDuration(s => s + 1), 1000);
    } else {
      setRecordingDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onSubmit(text, blob); // Auto submit on stop
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic Error", err);
      alert(t.micError || "Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTextSubmit = () => {
    if (text.trim()) {
      onSubmit(text);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-slide-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{featureTitle}</h2>
        <button onClick={onCancel} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-2xl relative">
        {isRecording ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
              <div className="relative w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
                <Mic className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-3xl font-mono font-bold text-white mb-2">{formatTime(recordingDuration)}</p>
              <p className="text-slate-400">{t.listening || "Listening..."}</p>
            </div>
            <button 
              onClick={stopRecording}
              className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold flex items-center gap-2 transition-colors"
            >
              <StopCircle className="w-5 h-5" /> {t.stopBtn || "Stop & Analyze"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={customPlaceholder || t.inputPlaceholder || "Type your topic, question, or problem here..."}
              className="w-full h-40 bg-slate-900 border border-slate-600 rounded-xl p-4 text-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              disabled={isProcessing}
            />
            
            <div className="flex gap-4">
              <button
                onClick={startRecording}
                disabled={isProcessing}
                className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Mic className="w-5 h-5" /> {t.recordBtn || "Record Audio"}
              </button>
              <button
                onClick={handleTextSubmit}
                disabled={!text.trim() || isProcessing}
                className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {isProcessing ? (t.processing || "Processing...") : (t.submitBtn || "Submit")}
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-center text-slate-500 text-sm">
        {t.supportText || "EchoLearn supports both voice and text input. Try explaining a concept aloud!"}
      </div>
    </div>
  );
};

export default UniversalInput;