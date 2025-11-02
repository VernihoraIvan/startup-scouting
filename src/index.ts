#!/usr/bin/env node

import { Command } from 'commander';
import { handleCommand } from './llm.js';

const program = new Command();

program
  .version('1.0.0')
  .description('A CLI tool to interact with local LLMs using Ollama')
  .argument('<prompt>', 'The prompt to send to the LLM')
  .action(async (prompt) => {
    await handleCommand(prompt);
  });

(async () => {
  try {
    await program.parseAsync(process.argv);
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    process.exit(1);
  }
})();
