export interface MatchedCompany {
  domain: string;
  description: string;
  name: string;
}

export interface Company {
  address: string | null;
  description: string;
  domain: string;
  keywords: string[];
  name: string;
  title: string;
}

export interface CommandOptions {
  challengeFile: string;
  companiesDb: string;
  query: string;
}
