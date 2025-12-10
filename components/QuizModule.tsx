import React, { useState } from 'react';
import { QuizItem } from '../types';
import { Check, X, ArrowRight, RotateCcw, Trophy, Lightbulb, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizModuleProps {
  quizData: QuizItem[];
  title: string;
  onComplete: () => void;
  translations: any;
}

const QuizModule: React.FC<QuizModuleProps> = ({ quizData, title, onComplete, translations: t }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  const currentQ = quizData[currentIdx];

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQ.answer) {
      if (!hintUsed) setScore(s => s + 1); // Full point only if no hint
      else setScore(s => s + 0.5); // Half point if hint used
      
      triggerConfetti(0.5);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < quizData.length - 1) {
      setCurrentIdx(p => p + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
      setHintUsed(false);
    } else {
      setShowSummary(true);
      if (score >= quizData.length * 0.8) {
         triggerConfetti(150, true);
      }
    }
  };

  const triggerConfetti = (countOrSpread: number, isBig = false) => {
    confetti({
      particleCount: isBig ? 150 : 50,
      spread: isBig ? 100 : 60,
      origin: { y: 0.7 },
      colors: ['#6366f1', '#10b981']
    });
  };

  if (showSummary) {
    return (
      <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 text-center animate-fade-in shadow-2xl">
        <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-indigo-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{t.quizComplete || "Quiz Complete!"}</h2>
        <p className="text-slate-400 mb-8">{t.youScored || "You scored"} {score} {t.outOf || "out of"} {quizData.length}</p>
        
        <div className="flex gap-4 justify-center">
          <button 
            onClick={onComplete}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            {t.backToDashboard || "Back to Dashboard"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
          <p className="text-slate-400 text-sm">{t.question || "Question"} {currentIdx + 1} {t.outOf || "of"} {quizData.length}</p>
        </div>
        <div className="text-indigo-400 font-mono font-bold">Score: {score}</div>
      </div>
      
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-8">
        <div 
          className="h-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${((currentIdx + 1) / quizData.length) * 100}%` }}
        />
      </div>

      <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl relative overflow-hidden">
        <h3 className="text-xl font-semibold text-white mb-8 leading-relaxed">
          {currentQ.question}
        </h3>

        <div className="space-y-4">
          {currentQ.options.map((option, idx) => {
            let stateClass = "border-slate-600 bg-slate-700/50 hover:bg-slate-700";
            let icon = null;

            if (isAnswered) {
               if (option === currentQ.answer) {
                 stateClass = "border-green-500 bg-green-500/20 text-green-100";
                 icon = <Check className="w-5 h-5 text-green-400" />;
               } else if (option === selectedOption) {
                 stateClass = "border-red-500 bg-red-500/20 text-red-100";
                 icon = <X className="w-5 h-5 text-red-400" />;
               } else {
                 stateClass = "border-slate-700 opacity-50";
               }
            } else if (selectedOption === option) {
              stateClass = "border-indigo-500 bg-indigo-500/20";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(option)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center group ${stateClass}`}
              >
                <span className="text-lg">{option}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Hint Section - Show button if not answered and not hinted yet */}
        {!isAnswered && !showHint && (
          <div className="mt-6 flex justify-center">
             <button 
               onClick={() => { setShowHint(true); setHintUsed(true); }}
               className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 text-sm font-medium transition-colors"
             >
               <Lightbulb className="w-4 h-4" /> {t.needHint || "Need a Hint?"}
             </button>
          </div>
        )}

        {showHint && !isAnswered && (
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200 text-sm animate-fade-in flex gap-3 items-start">
             <Lightbulb className="w-5 h-5 shrink-0" />
             <p><span className="font-bold">{t.hint || "Hint:"}</span> {currentQ.hint}</p>
          </div>
        )}

        {/* Explanation Footer */}
        {isAnswered && (
          <div className="mt-8 pt-6 border-t border-slate-700 animate-slide-up">
            <div className="flex gap-3 mb-6">
               <div className="mt-1"><HelpCircle className="w-5 h-5 text-indigo-400" /></div>
               <p className="text-slate-300">
                  <span className="font-bold text-indigo-400 block mb-1">{t.explanation || "Explanation"}</span> 
                  {currentQ.explanation}
               </p>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={nextQuestion}
                className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-lg font-bold hover:bg-slate-200 transition-colors"
              >
                {currentIdx === quizData.length - 1 ? (t.finish || "Finish") : (t.nextQuestion || "Next Question")}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModule;