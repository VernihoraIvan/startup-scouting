import ollama from 'ollama';
import * as fs from 'fs';
import { createMatchingPrompt,systemPrompt } from './prompts.js';
import type { MatchedCompany, Company, CommandOptions } from './types.js';
import { printResult } from './utils.js';

// Define an interface for the options for clarity

async function handleCommand(options: CommandOptions, challengeContent: string) {
  const startTime = Date.now();
  try {
    // 1. Read all companies into memory.
    const companiesContent = fs.readFileSync(options.companiesDb, 'utf-8');
    const companyLines = companiesContent.split('\n').filter(line => line.trim() !== '');
    const allCompanies: Company[] = companyLines.map(line => JSON.parse(line));

    // 2. Initialize an array to accumulate all matching companies.
    const allMatchingCompanies: MatchedCompany[] = [];

    const BATCH_SIZE = 100;
    console.log(`Analyzing ${allCompanies.length} companies in batches of ${BATCH_SIZE}...\n`);

    // 3. Process in batches.
    for (let i = 0; i < allCompanies.length; i += BATCH_SIZE) {
      const batch: Company[] = allCompanies.slice(i, i + BATCH_SIZE);
      const batchNumber = (i / BATCH_SIZE) + 1;

      const prompt: string = createMatchingPrompt(challengeContent, batch);

      const response = await ollama.generate({
        model: 'llama3:8b',
        system: systemPrompt,
        prompt: prompt,
        stream: false,
        format: 'json',
        options: {
          temperature: 0.0, // Set to 0 for deterministic, structured output,
        }
      });

      // 4. Parse the response and accumulate results.
      try {
        const jsonResponse = response.response;
        console.log('jsonResponse', jsonResponse);
        const matchedCompanies = JSON.parse(jsonResponse);
        
        if (Array.isArray(matchedCompanies) && matchedCompanies.length > 0) {
          const matchedDomains = matchedCompanies.map(c => c.domain).join(', ');
          console.log(`Found matches: ${matchedDomains}`);
          allMatchingCompanies.push(...matchedCompanies);
        } else if (matchedCompanies.length === 0) {
          console.log('No matches in this batch.');
        } else {
         allMatchingCompanies.push(matchedCompanies);
        }
      } catch (e) {
        console.warn(`Warning: Could not parse LLM response for batch ${batchNumber}. Response was:\n${response.response}`);
      }
      console.log('');
    }

    // 5. Display the final, consolidated report.
    console.log('--- Analysis Complete ---');
    if (allMatchingCompanies.length > 0) {
      printResult(allMatchingCompanies);
    } else {
      console.log('No matching companies were found in the entire dataset.');
    }

  } catch (error) {
    console.error('An error occurred during processing:', error);
  } finally {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log(`\nTotal processing time: ${duration.toFixed(2)} seconds.`);
  }
}

export { handleCommand };
