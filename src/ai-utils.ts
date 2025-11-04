import ollama from 'ollama';
import { LLM_MODEL_LLAMA3_8B } from './constants.js';

export async function processAICall(prompt: string, systemPrompt: string) {
  const response = await ollama.generate({
    model: LLM_MODEL_LLAMA3_8B,
    system: systemPrompt,
    prompt: prompt,
    stream: false,
    format: 'json',
    options: {
      temperature: 0.0,
    }
  });
  return JSON.parse(response.response);
}