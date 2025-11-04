#!/usr/bin/env node

import { Command } from 'commander';
import { handleCommand } from './llm.js';
import { parseChallenge } from './utils.js';
import type { CommandOptions } from './types.js';

const program = new Command();

program
  .version('1.0.0')
  .description('A CLI tool to interact with local LLMs using Ollama')
  .requiredOption('-c, --challenge-file <path>', 'Path to the challenge file')
  .requiredOption('-d, --companies-db <path>', 'Path to the companies database file')
  .requiredOption('-q, --query <string>', 'The query to ask the LLM')
  .action(async (options: CommandOptions) => {
    
    // 1. Parse the challenge file to get the criteria.
    const challengeContent = parseChallenge(options.challengeFile);
    
    // 2. Pass the options and criteria to the handler to process companies.
    await handleCommand(options, challengeContent);
  });

(async () => {
  try {
    await program.parseAsync(process.argv);
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    process.exit(1);
  }
})();
