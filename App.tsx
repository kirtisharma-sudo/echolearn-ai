import React, { useState, useEffect } from 'react';
import { Sparkles, Globe, Timer } from 'lucide-react';
import Dashboard from './components/Dashboard';
import UniversalInput from './components/UniversalInput';
import ResultView from './components/ResultView';
import { Logo } from './components/Logo';
import { generateStudyHelp } from './services/geminiService';
import { AppState, StudyFeature, StudyMode, StudyResponse, AppLanguage } from './types';

// Translation Dictionary
const TRANSLATIONS = {
  [AppLanguage.ENGLISH]: {
    welcome: "Welcome back, Scholar!",
    subtitle: "Your AI study companion is ready.",
    streak: "Streak",
    recent: "Recent",
    modeTutor: "👨‍🏫 Tutor",
    modeFriend: "🤜🤛 Friend",
    modeExam: "📝 Exam",
    modeFun: "🎉 Fun",
    // Gamification & Tools
    level: "Level",
    xp: "XP",
    todoTitle: "Study Plan",
    addTodoPlaceholder: "Add a task...",
    badgesTitle: "Achievements",
    badgeStreak: "Streak Master",
    badgeQuiz: "Quiz Wizard",
    badgeEarly: "Early Bird",
    badgeSolver: "Problem Solver",
    focusTime: "Focus Time",
    // Features
    featureExplainTitle: "Concept Explanations",
    featureExplainDesc: "Smart summaries & examples.",
    featureNotesTitle: "Notes Mode",
    featureNotesDesc: "Bullet points & formula sheets.",
    featureFlashcardsTitle: "Flashcards",
    featureFlashcardsDesc: "Generate cards for quick revision.",
    featureQuizTitle: "Quiz Generator",
    featureQuizDesc: "MCQs to test mastery.",
    featureDoubtTitle: "Doubt Solver",
    featureDoubtDesc: "Clear specific questions instantly.",
    featureEchoSpeakTitle: "EchoSpeak Evaluator",
    featureEchoSpeakDesc: "Oral answer feedback & scoring.",
    featureSolverTitle: "Numerical Solver",
    featureSolverDesc: "Step-by-step math help.",
    featureMoodTitle: "Mood Booster AI",
    featureMoodDesc: "Bored? Get jokes, facts & break tips.",
    // Input
    inputPlaceholder: "Type your topic, question, or problem here...",
    inputMoodPlaceholder: "How are you feeling? (e.g., Bored, Tired, Happy)",
    recordBtn: "Record Audio",
    stopBtn: "Stop & Analyze",
    submitBtn: "Submit",
    processing: "Processing...",
    listening: "Listening...",
    supportText: "EchoLearn supports both voice and text input. Try explaining a concept aloud!",
    // Result & Quiz
    backToDashboard: "Back to Dashboard",
    back: "Back",
    accuracyScore: "Accuracy Score",
    transcription: "Transcription",
    improvements: "Areas for Improvement",
    coachFeedback: "Coach's Feedback",
    quizComplete: "Quiz Complete!",
    youScored: "You scored",
    outOf: "out of",
    question: "Question",
    needHint: "Need a Hint?",
    hint: "Hint:",
    explanation: "Explanation",
    nextQuestion: "Next Question",
    finish: "Finish",
    flipPrompt: "Tap to flip",
    showAnswer: "Show Answer",
    showQuestion: "Show Question",
    term: "Question / Term",
    def: "Answer / Definition"
  },
  [AppLanguage.SPANISH]: {
    welcome: "¡Bienvenido de nuevo!",
    subtitle: "Tu compañero de estudio IA está listo.",
    streak: "Racha",
    recent: "Reciente",
    modeTutor: "👨‍🏫 Tutor",
    modeFriend: "🤜🤛 Amigo",
    modeExam: "📝 Examen",
    modeFun: "🎉 Diversión",
    level: "Nivel",
    xp: "XP",
    todoTitle: "Plan de Estudio",
    addTodoPlaceholder: "Añadir tarea...",
    badgesTitle: "Logros",
    badgeStreak: "Maestro de Racha",
    badgeQuiz: "Mago del Quiz",
    badgeEarly: "Madrugador",
    badgeSolver: "Solucionador",
    focusTime: "Tiempo Foco",
    featureExplainTitle: "Explicaciones",
    featureExplainDesc: "Resúmenes inteligentes.",
    featureNotesTitle: "Modo Notas",
    featureNotesDesc: "Puntos clave y fórmulas.",
    featureFlashcardsTitle: "Tarjetas Didácticas",
    featureFlashcardsDesc: "Repaso rápido.",
    featureQuizTitle: "Generador de Quiz",
    featureQuizDesc: "Pon a prueba tu dominio.",
    featureDoubtTitle: "Resolver Dudas",
    featureDoubtDesc: "Respuestas claras al instante.",
    featureEchoSpeakTitle: "EchoSpeak",
    featureEchoSpeakDesc: "Evaluación oral y feedback.",
    featureSolverTitle: "Solucionador Numérico",
    featureSolverDesc: "Ayuda matemática paso a paso.",
    featureMoodTitle: "Mood Booster",
    featureMoodDesc: "¿Aburrido? Chistes y consejos.",
    inputPlaceholder: "Escribe tu tema o pregunta aquí...",
    inputMoodPlaceholder: "¿Cómo te sientes? (ej. Aburrido, Cansado)",
    recordBtn: "Grabar Audio",
    stopBtn: "Parar y Analizar",
    submitBtn: "Enviar",
    processing: "Procesando...",
    listening: "Escuchando...",
    supportText: "Soporta voz y texto. ¡Intenta explicar un concepto en voz alta!",
    backToDashboard: "Volver al Panel",
    back: "Volver",
    accuracyScore: "Puntuación",
    transcription: "Transcripción",
    improvements: "Áreas de Mejora",
    coachFeedback: "Comentarios del Coach",
    quizComplete: "¡Quiz Completado!",
    youScored: "Obtuviste",
    outOf: "de",
    question: "Pregunta",
    needHint: "¿Necesitas una pista?",
    hint: "Pista:",
    explanation: "Explicación",
    nextQuestion: "Siguiente",
    finish: "Finalizar",
    flipPrompt: "Toca para voltear",
    showAnswer: "Ver Respuesta",
    showQuestion: "Ver Pregunta",
    term: "Pregunta / Término",
    def: "Respuesta / Definición"
  },
  [AppLanguage.FRENCH]: {
    welcome: "Bon retour!",
    subtitle: "Votre compagnon d'étude IA est prêt.",
    streak: "Série",
    recent: "Récent",
    modeTutor: "👨‍🏫 Tuteur",
    modeFriend: "🤜🤛 Ami",
    modeExam: "📝 Examen",
    modeFun: "🎉 Fun",
    level: "Niveau",
    xp: "XP",
    todoTitle: "Plan d'étude",
    addTodoPlaceholder: "Ajouter une tâche...",
    badgesTitle: "Succès",
    badgeStreak: "Maître de Série",
    badgeQuiz: "Sorcier du Quiz",
    badgeEarly: "Lève-tôt",
    badgeSolver: "Résolveur",
    focusTime: "Temps Focus",
    featureExplainTitle: "Explications",
    featureExplainDesc: "Résumés intelligents.",
    featureNotesTitle: "Mode Notes",
    featureNotesDesc: "Points clés et formules.",
    featureFlashcardsTitle: "Cartes Mémoire",
    featureFlashcardsDesc: "Révision rapide.",
    featureQuizTitle: "Générateur de Quiz",
    featureQuizDesc: "Testez vos connaissances.",
    featureDoubtTitle: "Résolution de Doutes",
    featureDoubtDesc: "Réponses claires instantanées.",
    featureEchoSpeakTitle: "EchoSpeak",
    featureEchoSpeakDesc: "Feedback oral.",
    featureSolverTitle: "Solveur Numérique",
    featureSolverDesc: "Aide mathématique étape par étape.",
    featureMoodTitle: "Booster d'Humeur",
    featureMoodDesc: "Ennuyé ? Blagues et astuces.",
    inputPlaceholder: "Tapez votre sujet ou question ici...",
    inputMoodPlaceholder: "Comment allez-vous ? (ex. Ennuyé)",
    recordBtn: "Enregistrer",
    stopBtn: "Arrêter & Analyser",
    submitBtn: "Envoyer",
    processing: "Traitement...",
    listening: "Écoute...",
    supportText: "Supporte voix et texte. Essayez d'expliquer à haute voix !",
    backToDashboard: "Retour au tableau de bord",
    back: "Retour",
    accuracyScore: "Précision",
    transcription: "Transcription",
    improvements: "Points à améliorer",
    coachFeedback: "Retour du coach",
    quizComplete: "Quiz terminé !",
    youScored: "Vous avez",
    outOf: "sur",
    question: "Question",
    needHint: "Besoin d'un indice ?",
    hint: "Indice :",
    explanation: "Explication",
    nextQuestion: "Suivant",
    finish: "Terminer",
    flipPrompt: "Appuyez pour retourner",
    showAnswer: "Voir Réponse",
    showQuestion: "Voir Question",
    term: "Question / Terme",
    def: "Réponse / Définition"
  },
  [AppLanguage.HINDI]: {
    welcome: "स्वागत है, विद्वान!",
    subtitle: "आपका AI अध्ययन साथी तैयार है।",
    streak: "सिलसिला",
    recent: "हाल ही में",
    modeTutor: "👨‍🏫 शिक्षक",
    modeFriend: "🤜🤛 दोस्त",
    modeExam: "📝 परीक्षा",
    modeFun: "🎉 मज़ा",
    level: "स्तर",
    xp: "XP",
    todoTitle: "अध्ययन योजना",
    addTodoPlaceholder: "नया कार्य जोड़ें...",
    badgesTitle: "उपलब्धियां",
    badgeStreak: "स्ट्रेक मास्टर",
    badgeQuiz: "क्विज़ जादूगर",
    badgeEarly: "जल्दी उठने वाला",
    badgeSolver: "समस्या निवारक",
    focusTime: "फोकस समय",
    featureExplainTitle: "अवधारणा स्पष्टीकरण",
    featureExplainDesc: "स्मार्ट सारांश और उदाहरण।",
    featureNotesTitle: "नोट्स मोड",
    featureNotesDesc: "मुख्य बिंदु और सूत्र।",
    featureFlashcardsTitle: "फ्लैशकार्ड",
    featureFlashcardsDesc: "त्वरित संशोधन के लिए कार्ड।",
    featureQuizTitle: "क्विज़ जेनरेटर",
    featureQuizDesc: "महारत परखें।",
    featureDoubtTitle: "शंका समाधान",
    featureDoubtDesc: "प्रश्नों का तुरंत उत्तर।",
    featureEchoSpeakTitle: "EchoSpeak",
    featureEchoSpeakDesc: "मौखिक प्रतिक्रिया और स्कोरिंग।",
    featureSolverTitle: "गणित सॉल्वर",
    featureSolverDesc: "चरण-दर-चरण गणित सहायता।",
    featureMoodTitle: "मूड बूस्टर",
    featureMoodDesc: "बोर हो रहे हैं? चुटकुले और सुझाव।",
    inputPlaceholder: "अपना विषय, प्रश्न या समस्या यहाँ टाइप करें...",
    inputMoodPlaceholder: "आप कैसा महसूस कर रहे हैं? (उदा. ऊब, थक)",
    recordBtn: "ऑडियो रिकॉर्ड करें",
    stopBtn: "रुकें और विश्लेषण करें",
    submitBtn: "जमा करें",
    processing: "प्रोसेसिंग...",
    listening: "सुन रहा हूँ...",
    supportText: "वॉयस और टेक्स्ट दोनों का समर्थन करता है। बोलकर समझाने की कोशिश करें!",
    backToDashboard: "डैशबोर्ड पर वापस जाएं",
    back: "वापस",
    accuracyScore: "सटीकता स्कोर",
    transcription: "प्रतिलेखन",
    improvements: "सुधार के क्षेत्र",
    coachFeedback: "कोच की प्रतिक्रिया",
    quizComplete: "क्विज़ पूरा हुआ!",
    youScored: "आपने स्कोर किया",
    outOf: "में से",
    question: "प्रश्न",
    needHint: "संकेत चाहिए?",
    hint: "संकेत:",
    explanation: "स्पष्टीकरण",
    nextQuestion: "अगला प्रश्न",
    finish: "समाप्त",
    flipPrompt: "पलटने के लिए टैप करें",
    showAnswer: "उत्तर दिखाएं",
    showQuestion: "प्रश्न दिखाएं",
    term: "प्रश्न / शब्द",
    def: "उत्तर / परिभाषा"
  },
  [AppLanguage.GERMAN]: {
    welcome: "Willkommen zurück!",
    subtitle: "Dein KI-Lernbegleiter ist bereit.",
    streak: "Serie",
    recent: "Kürzlich",
    modeTutor: "👨‍🏫 Tutor",
    modeFriend: "🤜🤛 Freund",
    modeExam: "📝 Prüfung",
    modeFun: "🎉 Spaß",
    level: "Level",
    xp: "XP",
    todoTitle: "Lernplan",
    addTodoPlaceholder: "Aufgabe hinzufügen...",
    badgesTitle: "Erfolge",
    badgeStreak: "Serienmeister",
    badgeQuiz: "Quiz-Profi",
    badgeEarly: "Früher Vogel",
    badgeSolver: "Problemlöser",
    focusTime: "Fokuszeit",
    featureExplainTitle: "Erklärungen",
    featureExplainDesc: "Smarte Zusammenfassungen.",
    featureNotesTitle: "Notizen",
    featureNotesDesc: "Stichpunkte & Formeln.",
    featureFlashcardsTitle: "Lernkarten",
    featureFlashcardsDesc: "Schnelle Wiederholung.",
    featureQuizTitle: "Quiz Generator",
    featureQuizDesc: "Teste dein Wissen.",
    featureDoubtTitle: "Fragenlöser",
    featureDoubtDesc: "Sofortige Antworten.",
    featureEchoSpeakTitle: "EchoSpeak",
    featureEchoSpeakDesc: "Mündliches Feedback.",
    featureSolverTitle: "Mathe-Löser",
    featureSolverDesc: "Schritt-für-Schritt Hilfe.",
    featureMoodTitle: "Mood Booster",
    featureMoodDesc: "Gelangweilt? Witze & Tipps.",
    inputPlaceholder: "Gib dein Thema oder deine Frage ein...",
    inputMoodPlaceholder: "Wie fühlst du dich?",
    recordBtn: "Aufnehmen",
    stopBtn: "Stopp & Analyse",
    submitBtn: "Senden",
    processing: "Verarbeite...",
    listening: "Höre zu...",
    supportText: "Unterstützt Sprache und Text. Erkläre es laut!",
    backToDashboard: "Zurück zum Dashboard",
    back: "Zurück",
    accuracyScore: "Genauigkeit",
    transcription: "Transkription",
    improvements: "Verbesserungswürdig",
    coachFeedback: "Feedback",
    quizComplete: "Quiz beendet!",
    youScored: "Du hast",
    outOf: "von",
    question: "Frage",
    needHint: "Hinweis nötig?",
    hint: "Hinweis:",
    explanation: "Erklärung",
    nextQuestion: "Nächste Frage",
    finish: "Beenden",
    flipPrompt: "Zum Wenden tippen",
    showAnswer: "Antwort zeigen",
    showQuestion: "Frage zeigen",
    term: "Frage / Begriff",
    def: "Antwort / Definition"
  },
  [AppLanguage.CHINESE]: {
    welcome: "欢迎回来，学者！",
    subtitle: "您的AI学习伴侣已准备就绪。",
    streak: "连胜",
    recent: "最近",
    modeTutor: "👨‍🏫 导师",
    modeFriend: "🤜🤛 朋友",
    modeExam: "📝 考试",
    modeFun: "🎉 趣味",
    level: "等级",
    xp: "经验值",
    todoTitle: "学习计划",
    addTodoPlaceholder: "添加新任务...",
    badgesTitle: "成就",
    badgeStreak: "连胜大师",
    badgeQuiz: "测验奇才",
    badgeEarly: "早起鸟",
    badgeSolver: "解决者",
    focusTime: "专注时间",
    featureExplainTitle: "概念解释",
    featureExplainDesc: "智能摘要与示例。",
    featureNotesTitle: "笔记模式",
    featureNotesDesc: "要点与公式。",
    featureFlashcardsTitle: "抽认卡",
    featureFlashcardsDesc: "快速复习。",
    featureQuizTitle: "测验生成器",
    featureQuizDesc: "测试掌握程度。",
    featureDoubtTitle: "疑难解答",
    featureDoubtDesc: "即时解惑。",
    featureEchoSpeakTitle: "口语评估",
    featureEchoSpeakDesc: "口语反馈与评分。",
    featureSolverTitle: "数值求解",
    featureSolverDesc: "逐步数学帮助。",
    featureMoodTitle: "情绪助推器",
    featureMoodDesc: "无聊？讲笑话和休息技巧。",
    inputPlaceholder: "在此输入您的主题、问题或难题...",
    inputMoodPlaceholder: "你感觉如何？（如：无聊，累）",
    recordBtn: "录音",
    stopBtn: "停止并分析",
    submitBtn: "提交",
    processing: "处理中...",
    listening: "正在聆听...",
    supportText: "支持语音和文本输入。尝试大声解释一个概念！",
    backToDashboard: "返回仪表板",
    back: "返回",
    accuracyScore: "准确度评分",
    transcription: "转录",
    improvements: "需要改进的地方",
    coachFeedback: "教练反馈",
    quizComplete: "测验完成！",
    youScored: "你的得分",
    outOf: "满分",
    question: "问题",
    needHint: "需要提示吗？",
    hint: "提示：",
    explanation: "解释",
    nextQuestion: "下一题",
    finish: "完成",
    flipPrompt: "点击翻转",
    showAnswer: "显示答案",
    showQuestion: "显示问题",
    term: "问题 / 术语",
    def: "答案 / 定义"
  },
  [AppLanguage.JAPANESE]: {
    welcome: "お帰りなさい！",
    subtitle: "AI学習コンパニオンの準備ができました。",
    streak: "ストリーク",
    recent: "最近",
    modeTutor: "👨‍🏫 講師",
    modeFriend: "🤜🤛 友達",
    modeExam: "📝 試験",
    modeFun: "🎉 楽しみ",
    level: "レベル",
    xp: "XP",
    todoTitle: "学習計画",
    addTodoPlaceholder: "新しいタスクを追加...",
    badgesTitle: "実績",
    badgeStreak: "ストリーク達人",
    badgeQuiz: "クイズ王",
    badgeEarly: "早起き",
    badgeSolver: "解決者",
    focusTime: "集中時間",
    featureExplainTitle: "概念解説",
    featureExplainDesc: "要約と例。",
    featureNotesTitle: "ノートモード",
    featureNotesDesc: "要点と公式。",
    featureFlashcardsTitle: "単語帳",
    featureFlashcardsDesc: "素早い復習。",
    featureQuizTitle: "クイズ作成",
    featureQuizDesc: "理解度テスト。",
    featureDoubtTitle: "質問解決",
    featureDoubtDesc: "即座に疑問を解消。",
    featureEchoSpeakTitle: "EchoSpeak",
    featureEchoSpeakDesc: "発話フィードバック。",
    featureSolverTitle: "計算ソルバー",
    featureSolverDesc: "段階的な数学ヘルプ。",
    featureMoodTitle: "ムードブースター",
    featureMoodDesc: "退屈？ジョークや休憩のヒント。",
    inputPlaceholder: "トピック、質問、または問題を入力してください...",
    inputMoodPlaceholder: "気分はどうですか？（例：退屈、疲れた）",
    recordBtn: "録音",
    stopBtn: "停止 & 分析",
    submitBtn: "送信",
    processing: "処理中...",
    listening: "聞き取り中...",
    supportText: "音声とテキストの両方に対応しています。声に出して説明してみましょう！",
    backToDashboard: "ダッシュボードに戻る",
    back: "戻る",
    accuracyScore: "正確性スコア",
    transcription: "文字起こし",
    improvements: "改善点",
    coachFeedback: "コーチからのフィードバック",
    quizComplete: "クイズ完了！",
    youScored: "スコア",
    outOf: "/",
    question: "質問",
    needHint: "ヒントが必要ですか？",
    hint: "ヒント:",
    explanation: "解説",
    nextQuestion: "次の質問",
    finish: "終了",
    flipPrompt: "タップして裏返す",
    showAnswer: "答えを見る",
    showQuestion: "質問を見る",
    term: "質問 / 用語",
    def: "答え / 定義"
  }
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.DASHBOARD);
  const [mode, setMode] = useState<StudyMode>(StudyMode.TUTOR);
  const [feature, setFeature] = useState<StudyFeature | null>(null);
  const [resultData, setResultData] = useState<StudyResponse | null>(null);
  const [language, setLanguage] = useState<AppLanguage>(AppLanguage.ENGLISH);
  const [focusSeconds, setFocusSeconds] = useState(0);
  
  const currentTranslations = TRANSLATIONS[language] || TRANSLATIONS[AppLanguage.ENGLISH];

  // Focus Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setFocusSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFeatureSelect = (selectedFeature: StudyFeature) => {
    setFeature(selectedFeature);
    setAppState(AppState.INPUT);
  };

  const handleSubmit = async (text: string, blob?: Blob) => {
    if (!feature) return;

    setAppState(AppState.PROCESSING);
    try {
      const minutes = Math.floor(focusSeconds / 60);
      const response = await generateStudyHelp(feature, mode, language, text, blob, minutes);
      setResultData(response);
      setAppState(AppState.RESULT);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
      setAppState(AppState.INPUT);
    }
  };

  const getFeatureTitle = () => {
    switch (feature) {
      case StudyFeature.EXPLAIN: return currentTranslations.featureExplainTitle;
      case StudyFeature.NOTES: return currentTranslations.featureNotesTitle;
      case StudyFeature.QUIZ: return currentTranslations.featureQuizTitle;
      case StudyFeature.SOLVER: return currentTranslations.featureSolverTitle;
      case StudyFeature.ECHOSPEAK: return currentTranslations.featureEchoSpeakTitle;
      case StudyFeature.FLASHCARDS: return currentTranslations.featureFlashcardsTitle;
      case StudyFeature.DOUBT_SOLVER: return currentTranslations.featureDoubtTitle;
      case StudyFeature.MOOD_BOOSTER: return currentTranslations.featureMoodTitle;
      default: return "";
    }
  };

  const getInputPlaceholder = () => {
    if (feature === StudyFeature.MOOD_BOOSTER) {
      return currentTranslations.inputMoodPlaceholder || "How are you feeling?";
    }
    return currentTranslations.inputPlaceholder;
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.DASHBOARD:
        return (
          <Dashboard 
            onSelectFeature={handleFeatureSelect} 
            currentMode={mode}
            onSelectMode={setMode}
            translations={currentTranslations}
          />
        );
      case AppState.INPUT:
      case AppState.PROCESSING:
        return (
          <UniversalInput 
            featureTitle={getFeatureTitle()}
            isProcessing={appState === AppState.PROCESSING}
            onSubmit={handleSubmit}
            onCancel={() => {
              setAppState(AppState.DASHBOARD);
              setFeature(null);
            }}
            translations={currentTranslations}
            customPlaceholder={getInputPlaceholder()}
          />
        );
      case AppState.RESULT:
        return resultData ? (
          <ResultView 
            data={resultData}
            onBack={() => {
              setAppState(AppState.DASHBOARD);
              setFeature(null);
              setResultData(null);
            }}
            translations={currentTranslations}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-slate-100 selection:bg-indigo-500 selection:text-white font-poppins relative">
      {/* Dynamic Aurora Background */}
      <div className="aurora-bg">
        <div className="aurora-blob blob-1"></div>
        <div className="aurora-blob blob-2"></div>
        <div className="aurora-blob blob-3"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="w-full border-b border-white/10 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div 
                className="flex items-center gap-3 cursor-pointer group" 
                onClick={() => {
                  setAppState(AppState.DASHBOARD);
                  setFeature(null);
                  setResultData(null);
                }}
              >
                <div className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 p-2 rounded-xl shadow-lg border border-white/5 transition-transform group-hover:scale-105">
                  <Logo className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 font-montserrat tracking-tight">
                    EchoLearn
                  </h1>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">AI Study Companion</p>
                </div>
              </div>

              {/* Focus Timer */}
              <div className="hidden md:flex items-center gap-2 bg-slate-800/40 border border-slate-700/50 px-3 py-1.5 rounded-lg">
                <Timer className="w-4 h-4 text-emerald-400" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 uppercase font-bold leading-none">{currentTranslations.focusTime || "Focus Time"}</span>
                  <span className="text-sm font-mono text-white font-medium leading-none mt-0.5">{formatTime(focusSeconds)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-200 text-xs font-medium backdrop-blur-sm">
                <Sparkles className="w-3 h-3" />
                {mode}
              </span>

              {/* Language Selector */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 rounded-full text-slate-300 text-xs font-medium transition-all backdrop-blur-sm">
                  <Globe className="w-3 h-3" />
                  {language}
                </button>
                <div className="absolute right-0 top-full mt-2 w-32 bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-xl shadow-xl overflow-hidden hidden group-hover:block animate-fade-in z-50">
                  {Object.values(AppLanguage).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-white/10 ${language === lang ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col p-4 md:p-8">
           {renderContent()}
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-white/10 py-6 text-center text-slate-500 text-sm font-light backdrop-blur-sm bg-slate-900/30">
          <p>© {new Date().getFullYear()} EchoLearn. Multi-lingual AI Companion.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;