export interface Company {
  address: string | null;
  description: string;
  domain: string;
  keywords: string[];
  name: string;
  title: string;
}

export type MatchedCompanyWithAnswer = Company & {
  answer: string;
};

export interface CommandOptions {
  challengeFile: string;
  companiesDb: string;
  query: string;
  localLlm?: boolean;
}
