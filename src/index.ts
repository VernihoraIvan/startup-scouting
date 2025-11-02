#!/usr/bin/env node

import { Command } from 'commander';
import { handleCommand } from './llm.js';

const program = new Command();

program
  .version('1.0.0')
  .description('A CLI tool to interact with local LLMs using Ollama')
  .requiredOption('-c, --challenge-file <path>', 'Path to the challenge file')
  .requiredOption('-d, --companies-db <path>', 'Path to the companies database file')
  .requiredOption('-q, --query <string>', 'The query to ask the LLM')
  .action(async (options) => {
    // We are just logging the parsed options for now, as requested.
    console.log('Parsed options:');
    console.log({
      challengeFile: options.challengeFile,
      companiesDb: options.companiesDb,
      query: options.query,
    });
    
    // The existing handleCommand function can be adapted later.
    // For now, we will create a prompt from the query.
    await handleCommand(options.query);
  });

(async () => {
  try {
    await program.parseAsync(process.argv);
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    process.exit(1);
  }
})();
