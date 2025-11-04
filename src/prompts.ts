import type { Company } from "./types.js";

export const systemPrompt = `
You are an expert venture capital analyst specializing in deep tech and defense technologies.
Your reputation depends on the quality and relevance of your startup recommendations.
You are extremely selective and have a high bar for what constitutes a "strong fit."

Your job is to:
- Identify startups that are an exceptional fit for the challenge.
- Return only startups that clearly match (≥90% relevance).
- If none match, return an empty JSON array [].
- Output must be a single valid JSON array — no text, comments, or explanations before or after.
`;

export const systemPromptAnswer = `
You are an expert venture capital analyst specializing in deep tech and defense technologies.
You carefully evaluate whether startups match a given challenge and answer the user's query based on the challenge.

Your job is to:
- Answer the user's query based on the startups that match the challenge.
- Return the answer to the user's query.
`;

export function createMatchingPrompt(challengeContent: string, batch: Company[]): string {
    const prompt = `
  You will be given:
  1. A challenge description (the "Challenge").
  2. A list of startup profiles (the "Startups").
  
  Your goal:
  - Scrutinize each startup against the Challenge with extreme diligence.
  - Decide if it has at least a 95% thematic and technical match. A partial match is not sufficient.
  - Your primary goal is precision. It is better to return no startups than to return a mediocre match.
  - Pay very close attention to Key Focus Areas, Keywords and Target Applications in the challenge description and match them with the startups (each startup has a keywords property and a description property).
  - 
  - You may return multiple startups if several fit well.
  - If none fit, return [].
  
  ---
  
  ### Challenge Description
  ${challengeContent}
  
  ---
  
  ### Startups (JSON Array)
  ${JSON.stringify(batch, null, 2)}
  
  ---

  
  ### Output format
  Return ONLY a valid JSON array. Each item must include:
  {
    "name": "Startup name",
    "domain": "Startup domain",
    "description": "A concise, evidence-based rationale for why this startup is an exceptional match for the challenge. Point to specific aspects of their technology or focus.",
    "relevance": "The relevance score of the startup to the challenge (must be 95% or higher)",
    "keywords": "The keywords that the startup matches the challenge",
    "address": "The address of the startup",
    "title": "The title of the startup"
  }
  
  ### Rules
  - call the array "matches"
  - If no startup matches, output exactly: { "matches": [] }
  - Be ruthless in your evaluation. Only the absolute best matches are acceptable.
  - Do not invent companies.
  - Do not include text outside the JSON.
  - Focus on conceptual and technical relevance, not surface keywords.
  - You can return more than one match if several are relevant.
  `;
    return prompt;
  }


export function createAnswerPrompt(matchedCompanies: Company[], query: string): string {
    const prompt = `
  You will be given:
  - A list of startups that match the challenge.
  - The user's query.
  
  Startups that match the challenge:
  ${JSON.stringify(matchedCompanies, null, 2)}

  Your goal:
  - Answer the user's query based on each startup that matches the challenge. 
  - Return the initial list of matched startups with the same structure but add "answer" property.
  - Do not remove any matched startup from the initial list.

  Return ONLY a valid JSON array. Each item must include:
  {
    "name": "Startup name",
    "domain": "Startup domain",
    "description": "Why this startup matches the challenge",
    "relevance": "The relevance score of the startup to the challenge",
    "answer": "The answer to the user's query"
  }

   ### Rules
  - call the array "matches"
  - If no startup matches, output exactly: { "matches": [] }
  - Do not invent companies.
  - Do not change the order of the startups in the initial list.
  - Do not include text outside the JSON.

  User query: ${query}
  `;
    return prompt;
  }

  export function createQueryPrompt(query: string): string {
    const prompt = `
    You will be given:
    - The user's query.
    
    Your goal:
    - Answer the user's query based on the challenge.
    - Return the answer to the user's query.
    `;
    return prompt;
  }