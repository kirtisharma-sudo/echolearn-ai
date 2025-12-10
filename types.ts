export enum AppState {
  DASHBOARD = 'DASHBOARD',
  INPUT = 'INPUT',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
  QUIZ = 'QUIZ'
}

export enum StudyMode {
  TUTOR = 'Tutor',
  FRIEND = 'Friend',
  EXAM = 'Exam',
  FUN = 'Fun'
}

export enum StudyFeature {
  EXPLAIN = 'EXPLAIN',
  NOTES = 'NOTES',
  QUIZ = 'QUIZ',
  SOLVER = 'SOLVER',
  ECHOSPEAK = 'ECHOSPEAK',
  FLASHCARDS = 'FLASHCARDS',
  DOUBT_SOLVER = 'DOUBT_SOLVER',
  MOOD_BOOSTER = 'MOOD_BOOSTER'
}

export enum AppLanguage {
  ENGLISH = 'English',
  SPANISH = 'Spanish',
  FRENCH = 'French',
  HINDI = 'Hindi',
  GERMAN = 'German',
  CHINESE = 'Chinese',
  JAPANESE = 'Japanese'
}

// Gamification Types
export interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string; // Identifier for Lucide icon
  unlocked: boolean;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

// For Quiz Feature
export interface QuizItem {
  question: string;
  options: string[];
  answer: string; // Correct answer
  hint: string;   // Hint before showing full answer
  explanation: string; // Full explanation
}

// For Flashcard Feature
export interface FlashcardItem {
  front: string; // Question or Term
  back: string;  // Answer or Definition
}

// For EchoSpeak Feature
export interface EchoSpeakData {
  accuracyScore: number;
  transcription: string;
  mistakes: string[];
  feedback: string;
  tutorResponse: string; // Conversational response from the AI Tutor
}

// Unified Response from Gemini
export interface StudyResponse {
  type: StudyFeature;
  markdownContent?: string; // For Explain, Notes, Solver, Doubt Solver, Mood Booster
  quizData?: QuizItem[];    // For Quiz
  flashcardData?: FlashcardItem[]; // For Flashcards
  echoSpeakData?: EchoSpeakData; // For EchoSpeak
  title: string;            // Title of the generated content
  imagePrompt?: string;     // Instructions to generate an image
  imageUri?: string;        // The generated image data URI
}

export interface AudioVisualizerProps {
  stream: MediaStream | null;
  isRecording: boolean;
}