import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with your API key
const genAI = new GoogleGenerativeAI("YOUR GEMINI API KEY HERE");

// Model configuration
const modelConfig = {
  model: "gemini-1.5-flash", // or "gemini-pro"
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_ONLY_HIGH"
    }
  ],
  generationConfig: {
    maxOutputTokens: 1000,
    temperature: 0.9
  }
};

// Get the model instance
export const getModel = () => genAI.getGenerativeModel(modelConfig);

// Start a new chat session
export const startChatSession = (model) => model.startChat({
  history: [
    {
      role: "user",
      parts: [{ text: "You are a helpful AI assistant. Keep responses concise and friendly." }]
    },
    {
      role: "model",
      parts: [{ text: "Hello! I'm your AI assistant. How can I help you today?" }]
    }
  ]
});