import React, { useState } from 'react';
import { StudyResponse, StudyFeature } from '../types';
import { ArrowLeft, Share2, Copy, FileText, Calculator, BookOpen, Mic2, CheckCircle, AlertTriangle, Lightbulb, Layers, HelpCircle, ChevronRight, ChevronLeft, RefreshCcw, Image as ImageIcon, Volume2, Square, MessageCircle, Play } from 'lucide-react';
import QuizModule from './QuizModule';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { generateTTS } from '../services/geminiService';
import { playRawAudio, stopAudio } from '../utils/audioUtils';

interface ResultViewProps {
  data: StudyResponse;
  onBack: () => void;
  translations: any;
}

const ResultView: React.FC<ResultViewProps> = ({ data, onBack, translations: t }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const handleSpeak = async (textToSpeak: string) => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
      return;
    }

    if (!textToSpeak) return;

    setIsLoadingAudio(true);
    try {
      const audioData = await generateTTS(textToSpeak);
      setIsPlaying(true);
      await playRawAudio(audioData, () => setIsPlaying(false));
    } catch (error) {
      console.error("Failed to play audio", error);
      setIsPlaying(false);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handleBack = () => {
    stopAudio();
    onBack();
  };
  
  // Quiz View
  if (data.type === StudyFeature.QUIZ && data.quizData) {
    return (
      <div className="w-full max-w-4xl mx-auto animate-fade-in">
        <button onClick={handleBack} className="mb-4 flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
           <ArrowLeft className="w-4 h-4" /> {t.backToDashboard || "Back to Dashboard"}
        </button>
        <QuizModule quizData={data.quizData} onComplete={handleBack} title={data.title} translations={t} />
      </div>
    );
  }

  // Flashcards View
  if (data.type === StudyFeature.FLASHCARDS && data.flashcardData) {
    const cards = data.flashcardData;
    const currentCard = cards[currentCardIndex];

    const nextCard = () => {
      stopAudio();
      setIsPlaying(false);
      setIsFlipped(false);
      setTimeout(() => {
         setCurrentCardIndex((prev) => (prev + 1) % cards.length);
      }, 200);
    };

    const prevCard = () => {
      stopAudio();
      setIsPlaying(false);
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
      }, 200);
    };

    return (
      <div className="w-full max-w-4xl mx-auto animate-fade-in flex flex-col h-[calc(100vh-150px)]">
         <div className="flex items-center justify-between mb-6">
          <button onClick={handleBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-800/50 px-4 py-2 rounded-lg">
             <ArrowLeft className="w-4 h-4" /> {t.back || "Back"}
          </button>
          <div className="flex items-center gap-2">
            <button 
                onClick={() => handleSpeak(isFlipped ? currentCard.back : currentCard.front)}
                disabled={isLoadingAudio}
                className={`p-2 rounded-lg border transition-all ${
                  isPlaying 
                    ? 'bg-indigo-500 text-white border-indigo-400 animate-pulse' 
                    : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:text-white hover:border-indigo-500'
                }`}
            >
               {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div className="text-white font-bold text-lg bg-slate-800/50 px-4 py-2 rounded-lg">
              {currentCardIndex + 1} / {cards.length}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative perspective-1000">
          <div 
             className={`w-full max-w-xl aspect-[4/3] relative cursor-pointer group transform-style-3d transition-all duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}
             onClick={() => setIsFlipped(!isFlipped)}
          >
             {/* Front */}
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl shadow-2xl p-10 flex flex-col items-center justify-center text-center backface-hidden border border-white/10">
                <span className="text-indigo-200 text-sm font-bold uppercase tracking-wider mb-6">{t.term || "Question / Term"}</span>
                <h3 className="text-3xl font-bold text-white font-montserrat">{currentCard.front}</h3>
                <div className="absolute bottom-6 text-white/50 text-xs flex items-center gap-2">
                   <RefreshCcw className="w-3 h-3" /> {t.flipPrompt || "Tap to flip"}
                </div>
             </div>

             {/* Back */}
             <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center justify-center text-center backface-hidden rotate-y-180">
                <span className="text-indigo-500 text-sm font-bold uppercase tracking-wider mb-6">{t.def || "Answer / Definition"}</span>
                <p className="text-xl text-slate-800 font-medium leading-relaxed">{currentCard.back}</p>
             </div>
          </div>

          {/* Controls */}
          <div className="mt-12 flex gap-8 items-center">
            <button onClick={prevCard} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-full text-white transition-all hover:scale-110 shadow-lg">
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button onClick={() => setIsFlipped(!isFlipped)} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-1">
               {isFlipped ? (t.showQuestion || 'Show Question') : (t.showAnswer || 'Show Answer')}
            </button>
            <button onClick={nextCard} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-full text-white transition-all hover:scale-110 shadow-lg">
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Generic Icon Helper
  const getIcon = () => {
    switch (data.type) {
      case StudyFeature.NOTES: return <FileText className="w-6 h-6 text-emerald-400" />;
      case StudyFeature.SOLVER: return <Calculator className="w-6 h-6 text-orange-400" />;
      case StudyFeature.DOUBT_SOLVER: return <HelpCircle className="w-6 h-6 text-rose-400" />;
      case StudyFeature.ECHOSPEAK: return <Mic2 className="w-6 h-6 text-pink-400" />;
      case StudyFeature.FLASHCARDS: return <Layers className="w-6 h-6 text-cyan-400" />;
      default: return <BookOpen className="w-6 h-6 text-blue-400" />;
    }
  };

  // EchoSpeak View
  if (data.type === StudyFeature.ECHOSPEAK && data.echoSpeakData) {
    const { accuracyScore, transcription, mistakes, feedback, tutorResponse } = data.echoSpeakData;
    const scoreData = [{ name: 'Score', value: accuracyScore, fill: '#ec4899' }];

    return (
      <div className="w-full max-w-4xl mx-auto animate-fade-in">
        <button onClick={handleBack} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-800/50 px-4 py-2 rounded-lg w-fit">
           <ArrowLeft className="w-4 h-4" /> {t.back || "Back"}
        </button>

        {/* AI Tutor Chat Bubble Section */}
        <div className="mb-8 p-6 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 rounded-3xl border border-indigo-500/30 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
             <MessageCircle className="w-32 h-32 text-white" />
           </div>
           
           <div className="relative z-10">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/50">
                   <Mic2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white font-montserrat">AI Tutor</h2>
             </div>
             
             <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 mb-4 backdrop-blur-sm">
               <p className="text-lg text-white font-medium italic">"{tutorResponse}"</p>
             </div>

             <button 
               onClick={() => handleSpeak(tutorResponse)}
               disabled={isLoadingAudio}
               className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                 isPlaying 
                 ? 'bg-pink-500 text-white animate-pulse' 
                 : 'bg-white text-indigo-900 hover:bg-slate-200 hover:scale-105'
               }`}
             >
                {isPlaying ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                {isPlaying ? "Stop Speaking" : "Hear Tutor"}
             </button>
           </div>
        </div>

        {/* Generated Image for EchoSpeak if available */}
        {data.imageUri && (
          <div className="w-full h-64 bg-black/50 border border-slate-700 rounded-3xl mb-8 flex items-center justify-center relative overflow-hidden group">
            <img 
              src={data.imageUri} 
              alt="AI Generated Illustration" 
              className="h-full object-contain shadow-lg transform transition-transform duration-500 group-hover:scale-105" 
            />
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white flex items-center gap-2 border border-white/10">
               <ImageIcon className="w-3 h-3" /> Visualization
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl border border-slate-700 flex flex-col items-center justify-center relative shadow-xl">
             <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4">{t.accuracyScore || "Accuracy Score"}</h3>
             <div className="h-40 w-40 relative">
               <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" cy="50%" innerRadius="80%" outerRadius="100%" 
                  barSize={10} data={scoreData} startAngle={90} endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar background dataKey="value" cornerRadius={30 / 2} fill="#ec4899" />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white">{accuracyScore}%</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl border border-slate-700 shadow-xl">
              <h3 className="flex items-center gap-2 text-white font-bold mb-4 font-montserrat">
                <FileText className="w-5 h-5 text-indigo-400" /> {t.transcription || "Transcription"}
              </h3>
              <p className="text-slate-300 italic text-sm border-l-4 border-indigo-500 pl-4 py-1 bg-slate-900/30 rounded-r-lg">
                "{transcription}"
              </p>
            </div>

            {mistakes.length > 0 && (
              <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl border border-slate-700 shadow-xl">
                 <h3 className="flex items-center gap-2 text-white font-bold mb-4 font-montserrat">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" /> {t.improvements || "Areas for Improvement"}
                 </h3>
                 <ul className="space-y-2">
                   {mistakes.map((m, i) => (
                     <li key={i} className="flex gap-2 text-slate-300 text-sm">
                       <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-yellow-500 shrink-0" />
                       {m}
                     </li>
                   ))}
                 </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-slate-800/80 backdrop-blur-md p-8 rounded-3xl border border-slate-700 shadow-xl relative">
           <div className="flex justify-between items-start mb-6">
             <h3 className="flex items-center gap-2 text-white font-bold font-montserrat">
                <Lightbulb className="w-5 h-5 text-indigo-400" /> {t.coachFeedback || "Coach's Feedback"}
             </h3>
             <button 
                onClick={() => handleSpeak(feedback)}
                disabled={isLoadingAudio}
                className={`p-2 rounded-lg border transition-all ${
                  isPlaying 
                    ? 'bg-indigo-500 text-white border-indigo-400 animate-pulse' 
                    : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:text-white hover:border-indigo-500'
                }`}
            >
               {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
            </button>
           </div>
           <div className="prose prose-invert prose-lg max-w-none prose-p:text-slate-300">
             {feedback.split('\n').map((line, i) => <p key={i}>{line}</p>)}
           </div>
        </div>
      </div>
    );
  }

  // Standard Markdown View (Explain, Notes, Solver, Doubt Solver)
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button onClick={handleBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-800/50 px-4 py-2 rounded-lg">
           <ArrowLeft className="w-4 h-4" /> {t.back || "Back"}
        </button>
        <div className="flex gap-2">
           <button 
              onClick={() => handleSpeak(data.markdownContent || "")}
              disabled={isLoadingAudio}
              className={`p-2 rounded-lg border transition-all ${
                isPlaying 
                  ? 'bg-indigo-500 text-white border-indigo-400 animate-pulse' 
                  : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:text-white hover:border-indigo-500'
              }`}
           >
             {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
           </button>
           <button className="p-2 bg-slate-800/50 rounded-lg text-slate-400 hover:text-white border border-slate-700 hover:border-indigo-500 transition-all">
             <Copy className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-700 bg-slate-900/50 flex items-center gap-4">
           <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 shadow-inner">
             {getIcon()}
           </div>
           <h1 className="text-2xl font-bold text-white font-montserrat">{data.title}</h1>
        </div>

        {data.imageUri && (
          <div className="w-full h-80 bg-black/50 border-b border-slate-700 flex items-center justify-center relative overflow-hidden group">
            <img 
              src={data.imageUri} 
              alt="AI Generated Illustration" 
              className="h-full object-contain shadow-lg rounded-lg transform transition-transform duration-500 group-hover:scale-105" 
            />
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white flex items-center gap-2 border border-white/10">
               <ImageIcon className="w-3 h-3" /> AI Generated
            </div>
          </div>
        )}
        
        <div className="p-8">
          <div className="prose prose-invert prose-lg max-w-none 
            font-poppins
            prose-headings:text-indigo-300 prose-headings:font-bold prose-headings:font-montserrat
            prose-p:text-slate-300 prose-p:leading-relaxed
            prose-li:text-slate-300 prose-li:marker:text-indigo-500
            prose-strong:text-white prose-strong:font-bold
            prose-code:bg-slate-900 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:text-pink-300 prose-code:font-mono prose-code:border prose-code:border-slate-700 prose-code:shadow-sm
            prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 prose-pre:rounded-2xl
            prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-slate-900/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
          ">
            {/* Simple Markdown Rendering */}
            {data.markdownContent?.split('\n').map((line, i) => {
              if (line.startsWith('###')) return <h3 key={i} className="mt-8 mb-4 text-xl flex items-center gap-2">{line.replace('###', '')}</h3>;
              if (line.startsWith('##')) return <h2 key={i} className="mt-10 mb-5 text-2xl border-b border-slate-700 pb-3">{line.replace('##', '')}</h2>;
              if (line.startsWith('🔹')) return <h3 key={i} className="mt-8 mb-3 text-lg font-bold text-indigo-300 flex items-center gap-2">{line}</h3>;
              if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc mb-1">{line.replace('- ', '')}</li>;
              if (line.startsWith('1. ')) return <li key={i} className="ml-4 list-decimal mb-1">{line.replace(/^\d+\.\s/, '')}</li>;
              if (line.trim() === '') return <div key={i} className="h-2"></div>;
              return <p key={i} className="mb-3">{line}</p>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;