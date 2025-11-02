# Startup Scouting CLI with Ollama

This is a command-line interface (CLI) tool that uses a local Large Language Model (LLM) through Ollama to analyze startup profiles.

## Prerequisites

Before you can run this application, you **must** have Ollama installed and running on your machine.

### 1. Install Ollama

Follow the official instructions to download and install Ollama for your operating system:

- [Ollama for macOS](https://ollama.com/download/mac)
- [Ollama for Windows](https://ollama.com/download/windows)
- [Ollama for Linux](https://ollama.com/download/linux)

After installation, ensure the Ollama application is running.

### 2. Pull a Model

This CLI is configured to use the `llama3` model by default. You need to pull it from the Ollama library. Open your terminal and run:

```bash
ollama pull llama3
```

This will download the model to your local machine, which may take some time.

## Installation and Usage

Once you have Ollama running with the `llama3` model, you can set up and run this CLI tool.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd startup-scouting
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Project

```bash
npm run build
```

This will compile the TypeScript code into JavaScript in the `dist/` directory.

### 4. Run the CLI

You can now run the CLI to send a prompt to your local LLM.

#### Using `npm start` (for development):

```bash
npm start -- "Your prompt about a startup goes here"
```
*Note the `--` which separates npm arguments from your script's arguments.*

#### Using the installed command (after `npm link` or global install):

To make the command available globally, you can use `npm link`:

```bash
npm link
```

Now you can use the `startup-scout` command from anywhere:

```bash
startup-scout "Your prompt about a startup goes here"
```
