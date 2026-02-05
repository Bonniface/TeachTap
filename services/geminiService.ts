import { GoogleGenAI, Type, Schema } from "@google/genai";
import { QuizQuestion, LearningPath } from "../types";

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const quizSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    question: {
      type: Type.STRING,
      description: "The quiz question text.",
    },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 4 possible answers.",
    },
    correctAnswerIndex: {
      type: Type.INTEGER,
      description: "The index (0-3) of the correct answer in the options array.",
    },
    explanation: {
      type: Type.STRING,
      description: "A short explanation of why the answer is correct.",
    },
  },
  required: ["question", "options", "correctAnswerIndex", "explanation"],
};

const pathSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        steps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    duration: { type: Type.STRING }
                },
                required: ["title", "description", "duration"]
            }
        }
    },
    required: ["title", "description", "steps"]
};

export const generateQuizForTopic = async (topic: string, context: string): Promise<QuizQuestion> => {
  try {
    const model = 'gemini-3-flash-preview'; 
    const prompt = `Create a single multiple-choice quiz question about the topic: "${topic}". 
    Context from the video transcript: "${context}".
    Ensure the question is engaging and educational.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        systemInstruction: "You are an educational AI assistant designed to test students' knowledge.",
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response from Gemini");
    }
    
    const quizData = JSON.parse(text) as QuizQuestion;
    return quizData;

  } catch (error) {
    console.error("Error generating quiz:", error);
    // Fallback mock data in case of API failure or missing key
    return {
      question: "What does E=mc² represent in physics?",
      options: [
        "Energy equals mass times circumference",
        "Energy equals mass times speed of light squared",
        "Electricity equals motion times current",
        "Energy equals motion constant squared"
      ],
      correctAnswerIndex: 1,
      explanation: "Einstein's mass-energy equivalence states that mass and energy are interchangeable, with c being the speed of light."
    };
  }
};

export const generateLearningPath = async (topic: string): Promise<Omit<LearningPath, 'id' | 'totalSteps' | 'completedSteps' | 'coverImage'>> => {
    try {
        const model = 'gemini-3-flash-preview';
        const prompt = `Create a structured 5-step learning path for the topic: "${topic}".
        Provide a catchy title for the course, a brief description, and 5 sequential steps/lessons.
        Each step should have a title, short description, and estimated duration (e.g. "5 min").`;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: pathSchema,
                systemInstruction: "You are an expert curriculum designer. Create engaging, structured learning paths.",
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from Gemini");

        const data = JSON.parse(text);
        
        // Transform to match interface partially
        return {
            topic: topic,
            title: data.title,
            description: data.description,
            steps: data.steps.map((s: any, i: number) => ({
                id: `step-${i}`,
                title: s.title,
                description: s.description,
                duration: s.duration,
                isCompleted: false,
                isLocked: i > 0 // Lock all except first
            }))
        };

    } catch (error) {
        console.error("Error generating path:", error);
        // Fallback
        return {
            topic,
            title: `Mastering ${topic}`,
            description: `A comprehensive guide to ${topic} basics.`,
            steps: [
                { id: '1', title: 'Introduction', description: 'Basics and overview', duration: '3 min', isCompleted: false, isLocked: false },
                { id: '2', title: 'Core Concepts', description: 'Fundamental principles', duration: '5 min', isCompleted: false, isLocked: true },
                { id: '3', title: 'Advanced Techniques', description: 'Taking it further', duration: '7 min', isCompleted: false, isLocked: true },
                { id: '4', title: 'Practical Application', description: 'Real world examples', duration: '6 min', isCompleted: false, isLocked: true },
                { id: '5', title: 'Final Review', description: 'Summary and quiz', duration: '4 min', isCompleted: false, isLocked: true }
            ]
        };
    }
};
