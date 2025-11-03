import type { Company } from "./types.js";

export const systemPrompt = `
You are an expert venture capital analyst specializing in deep tech. Your task is to identify startups that are a strong fit for a specific technology challenge. Your response MUST be a single, valid JSON array and nothing else. Do not add any text before or after the JSON. If no startups match, return an empty array [].
`;

export function createMatchingPrompt(challengeContent: string, batch: Company[]): string {
    const prompt = `
  Analyze the startups in the provided list and determine if they are a good match for the technology challenge below.
  
  **Challenge Description:**
  ---
  ${challengeContent}
  ---
  
  **Startup Profiles (JSON Array):**
  ---
  ${JSON.stringify(batch, null, 2)}
  ---
  
  Based on your analysis, provide a JSON array of objects for the matching startups.
  80% match threshold.
  It possible to have multiple matches for a single company.
  Each object must have three keys the output should be an array of objects:
  1. "domain" (string): The company's domain.
  2. "description" (string): A brief explanation for why the company is a match.
  3. "name" (string): The company's name.
  
  **IMPORTANT:** Your response must be a single, valid JSON array. Do not include any other text, explanations, or markdown formatting around the JSON. If no companies match, return an empty array \`[]\`.
  `;
    return prompt;
  }