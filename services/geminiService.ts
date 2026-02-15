
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, LearningPath } from "../types";

// Always use named parameter for apiKey and use the environment variable directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define response schemas using the Type enum from the SDK.
const quizSchema = {
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

const pathSchema = {
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

/**
 * Generates a quiz question for a given topic using Gemini 3 Flash.
 */
export const generateQuizForTopic = async (topic: string, context: string): Promise<QuizQuestion> => {
  try {
    // Basic text task uses gemini-3-flash-preview.
    const model = 'gemini-3-flash-preview'; 
    const prompt = `Create a fresh, unique, and challenging multiple-choice quiz question about the topic: "${topic}". 
    Use the following context from the video transcript for specific details: "${context}".
    
    Guidelines:
    1. Focus on a core concept mentioned in the context.
    2. Provide four plausible-sounding options, but only one is definitively correct.
    3. Ensure the explanation is insightful and adds value beyond just confirming the answer.
    4. Make the question distinct—avoid generic or surface-level facts.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        systemInstruction: "You are a master educator AI. You create engaging, thought-provoking quiz questions to help students master complex subjects.",
      },
    });

    // Access the text property directly, it is not a method.
    const text = response.text;
    if (!text) {
        throw new Error("No response from Gemini");
    }
    
    return JSON.parse(text.trim()) as QuizQuestion;

  } catch (error) {
    console.error("Error generating quiz:", error);
    // Fallback data if API key is missing or request fails.
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

/**
 * Generates a structured learning path using Gemini 3 Flash.
 */
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

        const data = JSON.parse(text.trim());
        
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
                isLocked: i > 0
            }))
        };

    } catch (error) {
        console.error("Error generating path:", error);
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
