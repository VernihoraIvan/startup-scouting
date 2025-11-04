import type {  Company, MatchedCompanyWithAnswer } from "./types.js";
import * as fs from 'fs';

export function parseChallenge(filePath: string): string {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return fileContent;
  } catch (error) {
    console.error(`Error reading challenge file at ${filePath}:`, error);
    process.exit(1);
  }
}

export function parseCompaniesDb(filePath: string): Company[] {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return fileContent.split('\n').filter(line => line.trim() !== '').map(line => JSON.parse(line));
  } catch (error) {
    console.error(`Error reading companies database file at ${filePath}:`, error);
    process.exit(1);
  }
}

export function printResult(matchedCompanies: MatchedCompanyWithAnswer[], query: string): void {
    console.log(`Found ${matchedCompanies.length} companies matching the challenge criteria:`);
    console.log('\n');
    console.log('────────────────────────────────────────────────────────────────────────────')
    console.log('\n');
    matchedCompanies.forEach(c => {
      console.log('\n');
      console.log(`${c.name.toUpperCase()} (${c.domain})`);
      console.log(`  Description: ${c.description}`);
      console.log('\n');
      console.log(`  Query: ${query}`);
      console.log(`  Answer: ${c.answer}`);
      console.log('\n');
      console.log('────────────────────────────────────────────────────────────────────────────');
    });
  }

  export const getENVVariables = () => {
    return {
      googleCloudProjectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      privateKey: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n"
      ) || '',
      clientEmail: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
      API_KEY: process.env.GOOGLE_CLOUD_API_KEY,
    };
  }

  export const isAllENVVariablesPresent = () => {
    return process.env.GOOGLE_CLOUD_PROJECT_ID && process.env.GOOGLE_CLOUD_PRIVATE_KEY && process.env.GOOGLE_CLOUD_CLIENT_EMAIL && process.env.GOOGLE_CLOUD_API_KEY;
  }