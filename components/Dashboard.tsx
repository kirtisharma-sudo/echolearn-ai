import React, { useState } from 'react';
import { StudyFeature, StudyMode, AppLanguage, TodoItem, Badge } from '../types';
import { BookOpen, BrainCircuit, FileText, Calculator, Flame, Clock, Mic2, Layers, HelpCircle, TrendingUp, ListTodo, Award, Zap, Star, Crown, Plus, Trash2, CheckCircle2, Circle, Smile } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Logo } from './Logo';

interface DashboardProps {
  onSelectFeature: (feature: StudyFeature) => void;
  currentMode: StudyMode;
  onSelectMode: (mode: StudyMode) => void;
  translations: any;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectFeature, currentMode, onSelectMode, translations }) => {
  const t = translations;

  // Mock Data
  const currentXP = 3450;
  const nextLevelXP = 5000;
  const currentLevel = 5;

  // To-Do State
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: '1', text: 'Revise Kinetic Energy', completed: false },
    { id: '2', text: 'Practice 5 Math Problems', completed: true },
    { id: '3', text: 'Read History Chapter 4', completed: false },
  ]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const progressData = [
    { day: 'Mon', score: 65, accuracy: 70 },
    { day: 'Tue', score: 72, accuracy: 75 },
    { day: 'Wed', score: 68, accuracy: 72 },
    { day: 'Thu', score: 85, accuracy: 82 },
    { day: 'Fri', score: 80, accuracy: 88 },
    { day: 'Sat', score: 92, accuracy: 90 },
    { day: 'Sun', score: 95, accuracy: 94 },
  ];

  const badges: Badge[] = [
    { id: '1', name: t.badgeStreak || 'Streak Master', desc: '7 Day Streak', icon: 'Zap', unlocked: true },
    { id: '2', name: t.badgeQuiz || 'Quiz Wizard', desc: 'Score 100%', icon: 'Star', unlocked: true },
    { id: '3', name: t.badgeEarly || 'Early Bird', desc: 'Study before 8AM', icon: 'Award', unlocked: false },
    { id: '4', name: t.badgeSolver || 'Problem Solver', desc: 'Solve 50 doubts', icon: 'Crown', unlocked: false },
  ];

  const features = [
    {
      id: StudyFeature.EXPLAIN,
      title: t.featureExplainTitle || 'Concept Explanations',
      desc: t.featureExplainDesc || 'Smart summaries & examples.',
      icon: <BookOpen className="w-8 h-8 text-blue-400" />,
      color: 'hover:border-blue-500/50 hover:bg-blue-500/10'
    },
    {
      id: StudyFeature.NOTES,
      title: t.featureNotesTitle || 'Notes Mode',
      desc: t.featureNotesDesc || 'Bullet points & formula sheets.',
      icon: <FileText className="w-8 h-8 text-emerald-400" />,
      color: 'hover:border-emerald-500/50 hover:bg-emerald-500/10'
    },
    {
      id: StudyFeature.FLASHCARDS,
      title: t.featureFlashcardsTitle || 'Flashcard Generator',
      desc: t.featureFlashcardsDesc || 'Generate cards for quick revision.',
      icon: <Layers className="w-8 h-8 text-cyan-400" />,
      color: 'hover:border-cyan-500/50 hover:bg-cyan-500/10'
    },
    {
      id: StudyFeature.QUIZ,
      title: t.featureQuizTitle || 'Quiz Generator',
      desc: t.featureQuizDesc || 'MCQs to test mastery.',
      icon: <BrainCircuit className="w-8 h-8 text-purple-400" />,
      color: 'hover:border-purple-500/50 hover:bg-purple-500/10'
    },
    {
      id: StudyFeature.DOUBT_SOLVER,
      title: t.featureDoubtTitle || 'Doubt Solver',
      desc: t.featureDoubtDesc || 'Clear specific questions instantly.',
      icon: <HelpCircle className="w-8 h-8 text-rose-400" />,
      color: 'hover:border-rose-500/50 hover:bg-rose-500/10'
    },
    {
      id: StudyFeature.ECHOSPEAK,
      title: t.featureEchoSpeakTitle || 'EchoSpeak Evaluator',
      desc: t.featureEchoSpeakDesc || 'Oral answer feedback & scoring.',
      icon: <Mic2 className="w-8 h-8 text-pink-400" />,
      color: 'hover:border-pink-500/50 hover:bg-pink-500/10'
    },
    {
      id: StudyFeature.SOLVER,
      title: t.featureSolverTitle || 'Numerical Solver',
      desc: t.featureSolverDesc || 'Step-by-step math help.',
      icon: <Calculator className="w-8 h-8 text-orange-400" />,
      color: 'hover:border-orange-500/50 hover:bg-orange-500/10'
    },
    {
      id: StudyFeature.MOOD_BOOSTER,
      title: t.featureMoodTitle || 'Mood Booster AI',
      desc: t.featureMoodDesc || 'Bored? Get jokes, facts & break tips.',
      icon: <Smile className="w-8 h-8 text-yellow-400" />,
      color: 'hover:border-yellow-500/50 hover:bg-yellow-500/10'
    }
  ];

  const modes = [
    { id: StudyMode.TUTOR, label: t.modeTutor || '👨‍🏫 Tutor', desc: 'Detailed' },
    { id: StudyMode.FRIEND, label: t.modeFriend || '🤜🤛 Friend', desc: 'Casual' },
    { id: StudyMode.EXAM, label: t.modeExam || '📝 Exam', desc: 'Strict' },
    { id: StudyMode.FUN, label: t.modeFun || '🎉 Fun', desc: 'Jokes' },
  ];

  const getBadgeIcon = (name: string) => {
    switch (name) {
      case 'Zap': return <Zap className="w-6 h-6" />;
      case 'Star': return <Star className="w-6 h-6" />;
      case 'Award': return <Award className="w-6 h-6" />;
      case 'Crown': return <Crown className="w-6 h-6" />;
      default: return <Award className="w-6 h-6" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Welcome & Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
        <div className="flex items-center gap-4">
           <div className="bg-slate-800/50 p-4 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-sm">
             <Logo className="w-16 h-16" />
           </div>
           <div>
             <h2 className="text-3xl font-bold text-white mb-2 font-montserrat">{t.welcome || "Welcome back, Scholar!"}</h2>
             <div className="flex items-center gap-3">
               <span className="bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wide">
                 {t.level || "Level"} {currentLevel}
               </span>
               <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${(currentXP / nextLevelXP) * 100}%` }}></div>
               </div>
               <span className="text-xs text-slate-400 font-mono">{currentXP}/{nextLevelXP} {t.xp || "XP"}</span>
             </div>
           </div>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-slate-800/50 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-700 flex items-center gap-3 shadow-lg">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{t.streak || "Streak"}</p>
              <p className="text-white font-bold text-lg">12 Days</p>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-700 flex items-center gap-3 shadow-lg">
            <div className="p-2 bg-blue-500/20 rounded-lg">
               <Clock className="w-6 h-6 text-blue-500" />
            </div>
            <div>
               <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{t.recent || "Recent"}</p>
               <p className="text-white font-bold text-lg">Physics</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Graph & Modes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Improvement Graph Section */}
          <div className="bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 font-montserrat">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Learning Trajectory
                </h3>
              </div>
              <div className="flex gap-2 text-sm">
                 <span className="flex items-center gap-1 text-indigo-300"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Score</span>
                 <span className="flex items-center gap-1 text-pink-300"><span className="w-2 h-2 rounded-full bg-pink-500"></span> Accuracy</span>
              </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="day" stroke="#94a3b8" axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} 
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  <Area type="monotone" dataKey="accuracy" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorAccuracy)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="bg-slate-800/40 backdrop-blur-md p-2 rounded-2xl flex overflow-x-auto border border-slate-700/50 gap-2">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => onSelectMode(m.id)}
                className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                  currentMode === m.id 
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]' 
                  : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span className="text-base font-bold">{m.label}</span>
                <span className="text-[10px] opacity-80 font-normal uppercase tracking-wider">{m.desc}</span>
              </button>
            ))}
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((f) => (
              <button
                key={f.id}
                onClick={() => onSelectFeature(f.id)}
                className={`p-6 bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 rounded-3xl text-left transition-all duration-300 group hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 ${f.color}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-slate-900/80 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    {f.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors font-montserrat">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Gamification Sidebar */}
        <div className="space-y-6">
          
          {/* To-Do List Tracker (Replaces Leaderboard) */}
          <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 flex flex-col h-fit min-h-[300px]">
             <div className="flex items-center gap-2 mb-4">
                <ListTodo className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white font-montserrat">{t.todoTitle || "Study Plan"}</h3>
             </div>
             
             {/* List */}
             <div className="space-y-2 mb-4 flex-1">
               {todos.map((todo) => (
                 <div key={todo.id} className="group flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-700/50 hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center gap-3 overflow-hidden">
                       <button onClick={() => toggleTodo(todo.id)} className="shrink-0 transition-transform active:scale-90">
                          {todo.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-500 hover:text-indigo-400" />
                          )}
                       </button>
                       <span className={`text-sm font-medium truncate ${todo.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                         {todo.text}
                       </span>
                    </div>
                    <button 
                      onClick={() => deleteTodo(todo.id)} 
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
               ))}
               {todos.length === 0 && (
                 <p className="text-center text-slate-500 text-sm py-4 italic">No active tasks.</p>
               )}
             </div>

             {/* Input */}
             <div className="flex items-center gap-2 mt-auto">
               <input 
                 type="text" 
                 value={newTodo}
                 onChange={(e) => setNewTodo(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                 placeholder={t.addTodoPlaceholder || "Add a task..."}
                 className="flex-1 bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
               />
               <button 
                 onClick={addTodo}
                 className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
               >
                 <Plus className="w-5 h-5" />
               </button>
             </div>
          </div>

          {/* Badges Card */}
          <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
               <Award className="w-5 h-5 text-purple-400" />
               <h3 className="text-lg font-bold text-white font-montserrat">{t.badgesTitle || "Achievements"}</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge) => (
                <div key={badge.id} className={`p-3 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${badge.unlocked ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-indigo-500/30' : 'bg-slate-900/50 border-slate-800 opacity-50 grayscale'}`}>
                   <div className={`p-2 rounded-full ${badge.unlocked ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-600'}`}>
                      {getBadgeIcon(badge.icon)}
                   </div>
                   <div>
                     <p className="text-xs font-bold text-white leading-tight">{badge.name}</p>
                     <p className="text-[10px] text-slate-500 mt-1">{badge.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;