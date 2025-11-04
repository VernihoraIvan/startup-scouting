import ollama from "ollama";
import { LLM_MODEL_GEMINI_2_5_FLASH_LITE, LLM_MODEL_LLAMA3_8B } from "./constants.js";
import { getENVVariables, isAllENVVariablesPresent } from "./utils.js";

async function callLocalLLM(prompt: string, systemPrompt: string) {
  const response = await ollama.generate({
    model: LLM_MODEL_LLAMA3_8B,
    system: systemPrompt,
    prompt: prompt,
    stream: false,
    format: "json",
  });

  return JSON.parse(response.response);
}

async function callGoogleCloudLLM(prompt: string, systemPrompt: string) {
  let response;
  
  const { googleCloudProjectId, API_KEY } = getENVVariables();
  const model = LLM_MODEL_GEMINI_2_5_FLASH_LITE;

    response = await fetch(
      `https://aiplatform.googleapis.com/v1/projects/${googleCloudProjectId}/locations/global/publishers/google/models/${model}?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          generationConfig: {
            temperature: 0.2,
            topP: 0.8,
            topK: 40,
          },
        }),
      }
    );

    const vertexResponseData = await response.json();

    if (
      vertexResponseData.candidates &&
      vertexResponseData.candidates.length > 0 &&
      vertexResponseData.candidates[0].content &&
      vertexResponseData.candidates[0].content.parts &&
      vertexResponseData.candidates[0].content.parts.length > 0
    ) {
      const responseText = vertexResponseData.candidates[0].content.parts[0].text
        .replace(/^```json\s*/, "")
        .replace(/```$/, "");
      try {
        return JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse JSON from LLM response:", e);
        console.error("Raw response text:", responseText);
        return { matches: [] };
      }
    } else {
      console.warn(
        "Warning: Gemini response was empty or malformed.",
        vertexResponseData
      );
      return { matches: [] };
    }
}

export async function processAICall(prompt: string, systemPrompt: string) {
  if (!isAllENVVariablesPresent()) {
    console.log("Using Ollama API");
    return await callLocalLLM(prompt, systemPrompt);
  } else {
    console.log("Using Google Cloud API");
    return await callGoogleCloudLLM(prompt, systemPrompt);
  }
}
