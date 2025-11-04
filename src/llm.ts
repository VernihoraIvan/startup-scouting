import * as fs from 'fs';
import { createAnswerPrompt, createMatchingPrompt, systemPrompt, systemPromptAnswer } from './prompts.js';
import type { Company, CommandOptions, MatchedCompanyWithAnswer } from './types.js';
import { printResult } from './utils.js';
import { processAICall } from './ai-utils.js';

async function handleCommand(options: CommandOptions, challengeContent: string) {
  const startTime = Date.now();
  try {
    // 1. Read all companies into memory.
    const companiesContent = fs.readFileSync(options.companiesDb, 'utf-8');
    const companyLines = companiesContent.split('\n').filter(line => line.trim() !== '');
    const allCompanies: Company[] = companyLines.map(line => JSON.parse(line));

    // 2. Initialize an array to accumulate all matching companies.
    const allMatchingCompanies: Company[] = [];

    const BATCH_SIZE = 100;
    console.log(`Analyzing ${allCompanies.length} companies in batches of ${BATCH_SIZE}...\n`);

    // 3. Process in batches to find matching companies.
    for (let i = 0; i < allCompanies.length; i += BATCH_SIZE) {
      const batch: Company[] = allCompanies.slice(i, i + BATCH_SIZE);
      const batchNumber = (i / BATCH_SIZE) + 1;

      const prompt: string = createMatchingPrompt(challengeContent, batch);

      const response = await processAICall(prompt, systemPrompt);

      try {
        if (response.matches && Array.isArray(response.matches) && response.matches.length > 0) {
          allMatchingCompanies.push(...response.matches);
        }
      } catch (e) {
        console.warn(`Warning: Could not parse LLM response for batch ${batchNumber}. Response was:\n${response}`);
      }
    }

    console.log('allMatchingCompanies', allMatchingCompanies);
    // 4. Process each matched company individually to get the answer to the user's query.
    const companiesWithAnswers: MatchedCompanyWithAnswer[] = [];
    console.log(`\n--- Answering query for ${allMatchingCompanies.length} matched companies ---`);

    for (let i = 0; i < allMatchingCompanies.length; i++) {
      const company = allMatchingCompanies[i];
      if (!company) continue;
      process.stdout.write(`Processing company ${i + 1} of ${allMatchingCompanies.length}: ${company.name}\r`);

      const answerPrompt = createAnswerPrompt([company], options.query);

      const answerResponse = await processAICall(answerPrompt, systemPromptAnswer);

      try {
        if (answerResponse.matches && Array.isArray(answerResponse.matches) && answerResponse.matches.length > 0) {
          companiesWithAnswers.push(answerResponse.matches[0]);
        }
      } catch (e) {
         console.warn(`\nWarning: Could not parse answer for ${company.name}. Response was:\n${answerResponse.response}`);
      }
    }

    // 5. Display the final, consolidated report.
    console.log('\n--- Analysis Complete ---');
    if (companiesWithAnswers.length > 0) {
      printResult(companiesWithAnswers, options.query);
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
