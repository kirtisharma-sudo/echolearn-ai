import { GoogleGenAI, Type, Schema, Modality } from "@google/genai";
import { StudyResponse, StudyFeature, StudyMode, AppLanguage } from '../types';
import { blobToBase64 } from '../utils/audioUtils';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for Quiz Mode
const quizSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    type: { type: Type.STRING, enum: [StudyFeature.QUIZ] },
    quizData: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          answer: { type: Type.STRING },
          hint: { type: Type.STRING },
          explanation: { type: Type.STRING }
        },
        required: ["question", "options", "answer", "hint", "explanation"]
      }
    }
  },
  required: ["title", "type", "quizData"]
};

// Schema for Flashcards
const flashcardSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    type: { type: Type.STRING, enum: [StudyFeature.FLASHCARDS] },
    flashcardData: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          front: { type: Type.STRING, description: "The term, question, or concept on the front" },
          back: { type: Type.STRING, description: "The definition, answer, or explanation on the back" }
        },
        required: ["front", "back"]
      }
    }
  },
  required: ["title", "type", "flashcardData"]
};

// Schema for EchoSpeak
const echoSpeakSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    type: { type: Type.STRING, enum: [StudyFeature.ECHOSPEAK] },
    echoSpeakData: {
      type: Type.OBJECT,
      properties: {
        accuracyScore: { type: Type.NUMBER, description: "0-100 score of accuracy" },
        transcription: { type: Type.STRING, description: "What the user said/typed" },
        mistakes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of factual errors or missing key points" },
        feedback: { type: Type.STRING, description: "Markdown formatted feedback including corrections and tips" },
        tutorResponse: { type: Type.STRING, description: "A conversational, encouraging response from the AI Tutor. Respond directly to the user's content." }
      },
      required: ["accuracyScore", "transcription", "mistakes", "feedback", "tutorResponse"]
    },
    imagePrompt: { type: Type.STRING, description: "Description of an image that would help the user improve (e.g., mouth shape for pronunciation, or a diagram of the concept)." }
  },
  required: ["title", "type", "echoSpeakData"]
};

// Schema for Text Content (Explain, Notes, Solver, Doubt Solver, Mood Booster)
const contentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    type: { type: Type.STRING, enum: [StudyFeature.EXPLAIN, StudyFeature.NOTES, StudyFeature.SOLVER, StudyFeature.DOUBT_SOLVER, StudyFeature.MOOD_BOOSTER] },
    markdownContent: { type: Type.STRING, description: "The formatted content using Markdown (headers, bullets, bold, math symbols)." },
    imagePrompt: { type: Type.STRING, description: "A detailed prompt to generate an educational illustration/diagram for this content. Leave empty if not needed." }
  },
  required: ["title", "type", "markdownContent"]
};

export const generateTTS = async (text: string): Promise<string> => {
  try {
    // Basic cleanup of markdown for better speech
    const cleanText = text.replace(/[#*`]/g, ''); 
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: cleanText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return base64Audio;
    }
    throw new Error("No audio generated");
  } catch (error) {
    console.error("TTS Error:", error);
    throw error;
  }
};

export const generateStudyHelp = async (
  feature: StudyFeature,
  mode: StudyMode,
  language: AppLanguage,
  inputText: string,
  audioBlob?: Blob,
  studyTimeMinutes: number = 0
): Promise<StudyResponse> => {
  
  let base64Audio = null;
  if (audioBlob) {
    base64Audio = await blobToBase64(audioBlob);
  }

  const systemInstruction = `
    You are EchoLearn, a premium Multimodal AI Tutor.
    Current Mode: ${mode.toUpperCase()}.
    Default Target Language: ${language}.
    
    🌍 **MULTILINGUAL RULE (CRITICAL)**: 
    Detect the language of the user's input. 
    - If the user asks/speaks in Spanish, **ANSWER IN SPANISH**.
    - If the user asks/speaks in French, **ANSWER IN FRENCH**.
    - If the user asks in English, answer in English.
    - Only use the 'Default Target Language' if the input language is ambiguous or if the user explicitly asks to learn that language.
    - NEVER reply in English if the user is asking a question in another language (unless they ask for a translation).

    📌 STYLE & TONE:
    - Simple, student-friendly language.
    - Use EMOJIS frequently 🌟✨ to keep it engaging.
    - Be supportive and motivating.

    📌 MULTIMODALITY (Images & Sound):
    - You can provide text, ask for images (via imagePrompt), and your text will be spoken (TTS).
    - **IMAGERY**: If a concept is visual (e.g., "Photosynthesis", "Geometry", "Geography"), ALWAYS provide a descriptive 'imagePrompt' so we can generate an image for the user.

    📌 FEATURE INSTRUCTIONS:

    For 'ECHOSPEAK' (AI Oral Coach & Tutor):
    - Role: You are a friendly voice tutor.
    - Task: Listen/Read the user's input.
    - Output:
      1. Transcription.
      2. Accuracy Score (0-100).
      3. Mistakes (Grammar, Pronunciation, Clarity).
      4. **tutorResponse**: This is CRITICAL. Write a natural, spoken-style response as if you are talking back to the user. 
         - If they said "Hola", say "¡Hola! ¿Cómo estás hoy?".
         - If they explained a concept wrong, say "Close! But actually...".
         - Keep this conversational and encouraging. Use EMOJIS.
      5. imagePrompt: If a visual aid helps (e.g., "Diagram of mouth position for 'th' sound" or "Chart of verb tenses"), describe it.

    For 'MOOD_BOOSTER':
    - Context: Studied for ${studyTimeMinutes} mins.
    - Structure: Motivation -> Break Idea -> Fun Fact -> Micro-Lesson.
    - Tone: Super fun & energetic.

    For 'EXPLAIN' / 'SOLVER' / 'DOUBT_SOLVER':
    - Structure: Summary, Key Points (bullets), Detailed Explanation, Example, Quick Revision.
    - If math/science, ALWAYS try to generate an 'imagePrompt' for a diagram.

    For 'NOTES' / 'FLASHCARDS' / 'QUIZ':
    - Strict formatting as per schema.
    - Use simple language.
  `;

  let prompt = "";
  let schema = contentSchema;

  switch (feature) {
    case StudyFeature.EXPLAIN:
      prompt = `Explain: "${inputText}". Simple language, emojis. Image prompt if visual.`;
      break;
    case StudyFeature.NOTES:
      prompt = `Create notes for: "${inputText}". Bullets. Simple language.`;
      break;
    case StudyFeature.SOLVER:
      prompt = `Solve: "${inputText}". Step-by-step. Image prompt if geometry/physics.`;
      break;
    case StudyFeature.DOUBT_SOLVER:
      prompt = `Resolve doubt: "${inputText}". Clear answer.`;
      break;
    case StudyFeature.MOOD_BOOSTER:
      prompt = `User studied ${studyTimeMinutes} mins. Input: "${inputText}". Motivation, Break, Fact, Micro-lesson.`;
      break;
    case StudyFeature.QUIZ:
      prompt = `Quiz on: "${inputText}". 5 MCQs. increasing difficulty.`;
      schema = quizSchema;
      break;
    case StudyFeature.FLASHCARDS:
      prompt = `Flashcards for: "${inputText}".`;
      schema = flashcardSchema;
      break;
    case StudyFeature.ECHOSPEAK:
      prompt = `Act as AI Tutor. Analyze user input: "${inputText}" (or audio). Provide accuracy, mistakes, feedback, and a conversational 'tutorResponse'. Include imagePrompt if helpful.`;
      schema = echoSpeakSchema;
      break;
  }

  try {
    const parts: any[] = [{ text: prompt }];
    
    if (base64Audio) {
      parts.unshift({
        inlineData: {
          mimeType: audioBlob?.type || "audio/webm",
          data: base64Audio,
        },
      });
      parts.push({ text: "The user input is audio. Transcribe it, detect the language, and then perform the requested task in that language." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: feature === StudyFeature.MOOD_BOOSTER ? 1.0 : (mode === StudyMode.FUN ? 0.8 : 0.3),
      },
    });

    if (response.text) {
      const parsedResponse = JSON.parse(response.text) as StudyResponse;

      // Check if image generation is needed
      if (parsedResponse.imagePrompt) {
        try {
          const imageResp = await ai.models.generateContent({
             model: 'gemini-2.5-flash-image',
             contents: {
               parts: [{ text: parsedResponse.imagePrompt }],
             },
             config: {
               imageConfig: { aspectRatio: "4:3" }
             },
          });
          
          for (const part of imageResp.candidates[0].content.parts) {
            if (part.inlineData) {
              parsedResponse.imageUri = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
              break;
            }
          }
        } catch (imageError) {
          console.error("Image generation failed:", imageError);
        }
      }

      return parsedResponse;
    } else {
      throw new Error("No response received.");
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};