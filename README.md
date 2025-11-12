# Startup Scouting AI CLI

This is a powerful command-line interface (CLI) tool designed to automate the process of scouting startups. It uses Large Language Models (LLMs) to analyze a database of companies against a specific technology challenge, identify the most relevant startups, and answer a user-defined query for each match.

The tool is dual-backend, capable of using either a local LLM via Ollama or the Google Cloud Vertex AI (Gemini) for its analysis.

## How It Works

The CLI follows a two-stage process to deliver precise and relevant results:

1.  **Matching Stage**: The tool first reads the challenge description and processes your entire database of companies in small, efficient batches. For each batch, it sends the company profiles and the challenge description to the LLM, asking it to identify which startups are a strong conceptual match.

2.  **Answering Stage**: Once a list of all matching companies has been compiled, the tool processes each of these matches individually. For every matching company, it makes a second, more focused call to the LLM. This call provides the specific company's details and asks the LLM to answer the query you provided from the perspective of that company.

Finally, the tool prints a consolidated report to the console and saves the full output to a uniquely named text file in the `export/` directory.

## Prerequisites

Before you begin, ensure you have the following installed and configured on your system.

### 1. Node.js

You need Node.js (version 16 or higher) and npm to run this project. You can download it from [nodejs.org](https://nodejs.org/).

### 2. LLM Backend

You must configure at least one of the following LLM backends.

#### Option A: Local LLM (Ollama)

This is the recommended setup for local development and testing.

1.  **Install Ollama**: Follow the official instructions to download and install Ollama for your operating system from [ollama.com](https://ollama.com/).
2.  **Start Ollama**: Ensure the Ollama application is running in the background.
3.  **Pull a Model**: The CLI is configured to use `llama3:8b` or `deepseek-r1:7b`. Open your terminal and pull the model by running:
    ```bash
    ollama pull llama3:8b
    ```

#### Option B: Google Cloud (Vertex AI)

For more powerful processing, you can configure the tool to use Google's Gemini model via Vertex AI.

1.  **Set up a Google Cloud Project**: Create a project and enable the "Vertex AI API".
2.  **Create a Service Account**: Set up a service account with the necessary permissions (e.g., "Vertex AI User").
3.  **Create Environment Variables**: Create a `.env` file in the root of the project directory and add your Google Cloud credentials to it. You can use the `.env.example` file as a template:
    ```env
    GOOGLE_CLOUD_PROJECT_ID="your-gcp-project-id"
    GOOGLE_CLOUD_API_KEY="your-api-key"
    ```

## Installation and Setup

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd startup-scouting
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Build the Project**:
    This compiles the TypeScript code into JavaScript in the `dist/` directory.
    ```bash
    npm run build
    ```

## Usage

You can now run the CLI from the root of the project directory.

### Command Structure

The command requires three arguments: a challenge file, a companies database, and a query.

```bash
startup-scout -c <path_to_challenge> -d <path_to_db> -q "<your_query>" 
```

default command for local LLM (-l flag):
```bash
startup-scout --challenge-file ./uxs-startup-challenge.md --companies-db ./companies.jsonl --query "Is the company based in Germany?" -l
```

### Arguments

-   `-c, --challenge-file <path>`: (Required) The path to the markdown file describing the technology challenge.
-   `-d, --companies-db <path>`: (Required) The path to the `.jsonl` file containing the list of startups.
-   `-q, --query <string>`: (Required) The specific question you want to ask about the matching companies.
-   `-l, --local-llm`: (Optional) A flag to force the use of the local Ollama model, even if Google Cloud credentials are configured in your `.env` file.

### Examples

#### Example 1: Using the Default LLM

This command will automatically use Google Cloud if your `.env` file is configured, otherwise it will fall back to your local Ollama instance.

```bash
node dist/index.js -c uxs-startup-challenge.md -d companies.jsonl -q "Which of these companies has experience with defense technology?"
```

#### Example 2: Forcing the Local LLM

This command uses the `-l` flag to ensure your local Ollama instance is used.

```bash
node dist/index.js -c uxs-startup-challenge.md -d companies.jsonl -q "Summarize the core technology of each matching company." -l
```

You can also use the `npm start` script for convenience:

```bash
npm start -- -c uxs-startup-challenge.md -d companies.jsonl -q "Which of these companies has experience with defense technology?"
```
*Note the `--` which separates npm arguments from your script's arguments.*
