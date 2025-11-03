import type { MatchedCompany } from "./types.js";
import * as fs from 'fs';

export function parseChallenge(filePath: string): string {
  try {
    // Read the entire content of the challenge file.
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return fileContent;
  } catch (error) {
    console.error(`Error reading challenge file at ${filePath}:`, error);
    process.exit(1);
  }
}

export function printResult(matchedCompanies: MatchedCompany[]): void {
    console.log(`Found ${matchedCompanies.length} companies matching the challenge criteria:`);
    console.log('────────────────────────────────────────────────────────────────────────────')
    matchedCompanies.forEach(c => {
      console.log(`${c.name.toUpperCase()} (${c.domain})`);
      console.log(`  Description: ${c.description}`);
      console.log('────────────────────────────────────────────────────────────────────────────');
    });
  }