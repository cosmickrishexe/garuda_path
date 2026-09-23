import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';

export let geminiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  try {
    geminiClient = new GoogleGenAI({ apiKey });
    console.log('✅ Google Gemini API client successfully initialized.');
  } catch (err) {
    console.warn('⚠️ Google Gemini API initialization error:', err);
    geminiClient = null;
  }
} else {
  console.warn('⚠️ GEMINI_API_KEY is not configured or using placeholder. Running with simulated AI mobility responses.');
}

export const GEMINI_MODEL = 'gemini-2.5-flash';
